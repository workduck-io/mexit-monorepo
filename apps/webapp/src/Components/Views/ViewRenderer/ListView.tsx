import React, { useCallback, useEffect, useState } from 'react'

import { get } from 'lodash'

import { SearchResult } from '@workduck-io/mex-search'
import { KeyBindingMap, tinykeys } from '@workduck-io/tinykeys'

import { mog } from '@mexit/core'
import { Description, TaskListWrapper } from '@mexit/shared'

import { useViewFilterStore } from '../../../Hooks/todo/useTodoFilters'
import { useEnableShortcutHandler } from '../../../Hooks/useChangeShortcutListener'
import { useFilterStore } from '../../../Hooks/useFilters'
import { useSearch } from '../../../Hooks/useSearch'
import { useViewFilters } from '../../../Hooks/useViewFilters'
import useMultipleEditors from '../../../Stores/useEditorsStore'
import useModalStore from '../../../Stores/useModalStore'
import ViewBlockRenderer from '../ViewBlockRenderer'
import ResultGroup from '../ViewBlockRenderer/BlockContainer'

import { ViewRendererProps } from '.'

const ListView: React.FC<ViewRendererProps> = (props) => {
  const [results, setResults] = useState({})
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  const { queryIndex } = useSearch()
  const { generateQuery } = useViewFilters()
  const { enableShortcutHandler } = useEnableShortcutHandler()

  const sortType = useFilterStore((store) => store.sortType)
  const sortOrder = useFilterStore((store) => store.sortOrder)
  const groupBy = useFilterStore((store) => store.groupBy)
  const isModalOpen = useModalStore((store) => store.open)
  const isPreviewEditors = useMultipleEditors((store) => store.editors)

  const globalJoin = useFilterStore((store) => store.globalJoin)
  const currentFilters = useViewFilterStore((store) => store.currentFilters)

  const groupByKey = (items: any[], key: string) => {
    const groupedValues = {}

    items.forEach((item) => {
      const value = get(item, key) ?? 'Ungrouped'

      if (!groupedValues[value]) {
        groupedValues[value] = []
      }

      groupedValues[value].push(item)
    })

    return groupedValues
  }

  useEffect(() => {
    const query = generateQuery(currentFilters)
    queryIndex('node', query).then((res) => {
      mog('RESULT IS', { res, query, currentFilters })
      setResults(groupByKey(res, groupBy))
    })
  }, [props.viewId, currentFilters])

  // const { changeStatus, changePriority } = useTodoKanban()

  // const todosArray = useMemo(() => Object.values(nodeTodos).flat(), [nodeTodos])

  const selectFirst = () => {
    const firstCard = results.length > 0 && results[0]
    if (firstCard) {
      // console.log('select first', { firstCard })
      setSelectedCardId(firstCard.id)
    }
  }

  // const getTodoFromCard = (card: TodoKanbanCard): TodoType => {
  //   return todosArray.find((todo) => todo.nodeid === card.nodeid && todo.id === card.todoid)
  // }

  /**
   * TODO: Based on Type
   */
  // const changeSelectedPriority = (priority: PriorityType) => {
  //   if (!selectedCardId) return
  //   const selectedCard = list.find((card) => card.id === selectedCardId)
  //   const todoFromCard = getTodoFromCard(selectedCard)
  //   changePriority(todoFromCard, priority)
  // }

  const selectNewCard = useCallback(
    (direction: 'up' | 'down') => {
      const list = Object.values(results).flat(1) as SearchResult[]

      const selectedIndex = list.findIndex((card) => card.id === selectedCardId)
      // console.log('selectNewCard', { direction, selectedCardId, selectedIndex })
      if (!selectedCardId) {
        selectFirst()
        return
      }
      // mog('selected card', { selectedCard, selectedColumn, selectedColumnLength, selectedIndex, direction })
      switch (direction) {
        case 'up': {
          const prevCard = list[(selectedIndex - 1 + list.length) % list.length]
          // mog('prevCard', { prevCard })

          if (prevCard) {
            mog('selected card', { selectedCardId, prevCard, selectedIndex })
            setSelectedCardId(prevCard.id)
          }
          break
        }

        case 'down': {
          const nextCard = list[(selectedIndex + 1) % list.length]

          if (nextCard) {
            mog('selected card', { selectedCardId, nextCard })
            setSelectedCardId(nextCard.id)
          }
          break
        }
      }
    },
    [selectedCardId]
  )

  const eventWrapper = (fn: (event) => void): ((event) => void) => {
    return (e) => {
      enableShortcutHandler(() => {
        e.preventDefault()
        fn(e)
      })
    }
  }

  const wrapEvents = (map: KeyBindingMap) =>
    Object.entries(map).reduce((acc, [key, value]) => {
      acc[key] = eventWrapper(value)
      return acc
    }, {})

  useEffect(() => {
    const shorcutConfig = (): KeyBindingMap => {
      if (isModalOpen !== undefined) return {}

      return wrapEvents({
        Escape: () => {
          setSelectedCardId(null)
        },

        ArrowDown: () => selectNewCard('down'),
        ArrowUp: () => selectNewCard('up')

        /**
         * TODO:
         *
         * Show Shortcuts based on render Type
         *
         */
        // '$mod+1': () => changeSelectedPriority(PriorityType.low),
        // '$mod+2': () => changeSelectedPriority(PriorityType.medium),
        // '$mod+3': () => changeSelectedPriority(PriorityType.high),
        // '$mod+0': () => changeSelectedPriority(PriorityType.noPriority)
      })
    }

    if (!isPreviewEditors || (isPreviewEditors && !Object.entries(isPreviewEditors).length)) {
      const unsubscribe = tinykeys(window, shorcutConfig())

      return () => {
        unsubscribe()
      }
    }
  }, [isModalOpen, isPreviewEditors, selectNewCard])

  if (!currentFilters.length)
    return (
      <TaskListWrapper>
        <Description>Apply filters to create a view of the data that&apos;s most relevant to you.</Description>
        <Description>Start by applying filters to customize your view.</Description>
      </TaskListWrapper>
    )

  if (!Object.values(results)?.flat(1)?.length)
    return (
      <TaskListWrapper>
        <Description>No Results</Description>
      </TaskListWrapper>
    )

  return (
    <TaskListWrapper>
      {Object.entries(results)?.map(([group, items]: [string, Array<SearchResult>]) => (
        <ResultGroup label={group} count={items.length}>
          {items.map((block) => (
            <ViewBlockRenderer key={block?.id} selectedBlockId={selectedCardId} block={block} />
          ))}
        </ResultGroup>
      ))}
    </TaskListWrapper>
  )
}

export default ListView
