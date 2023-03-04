import React, { useCallback, useEffect, useState } from 'react'

import { get } from 'lodash'

import { SearchResult } from '@workduck-io/mex-search'
import { KeyBindingMap, tinykeys } from '@workduck-io/tinykeys'

import { mog } from '@mexit/core'
import { TaskListWrapper } from '@mexit/shared'

import { useEnableShortcutHandler } from '../../../Hooks/useChangeShortcutListener'
import { useFilterStore } from '../../../Hooks/useFilters'
import { useSearch } from '../../../Hooks/useSearch'
import useMultipleEditors from '../../../Stores/useEditorsStore'
import useModalStore from '../../../Stores/useModalStore'
import ViewBlockRenderer from '../ViewBlockRenderer'
import ResultGroup from '../ViewBlockRenderer/BlockContainer'

import { ViewRendererProps } from '.'

/**
 *  [
    {
        "id": "TEMP_KGkVJ",
        "text": "First is ehre",
        "data": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1677511345771,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1677511345771
        },
        "entity": "TASK",
        "parent": "NODE_VGwVtY8n6n7LEDGt9iCq8",
        "tags": [
            "TASK",
            "NODE_VGwVtY8n6n7LEDGt9iCq8"
        ]
    },
    {
        "id": "TEMP_VMiw3",
        "text": "Notes of Untitled",
        "data": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1677511269545,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1677511261500
        },
        "entity": "TASK",
        "parent": "NODE_VGwVtY8n6n7LEDGt9iCq8",
        "tags": [
            "TASK",
            "NODE_VGwVtY8n6n7LEDGt9iCq8"
        ]
    },
    {
        "id": "TEMP_TKkqb",
        "text": "Task of Note is here",
        "data": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1677248466095,
            "createdBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "createdAt": 1677248216323
        },
        "entity": "TASK",
        "parent": "NODE_ANX9K9aV8ggpGBg9xDmYP",
        "tags": [
            "TASK",
            "NODE_ANX9K9aV8ggpGBg9xDmYP"
        ]
    },
    {
        "id": "TEMP_4QM8h",
        "text": "Quick Capture",
        "data": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1676290970773
        },
        "entity": "TASK",
        "parent": "NODE_UQ9irg3DmXkyhfmpzfaEn",
        "tags": [
            "TASK",
            "NODE_UQ9irg3DmXkyhfmpzfaEn"
        ]
    },
    {
        "id": "TEMP_zAy3j",
        "text": "Actions",
        "data": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1676889207800
        },
        "entity": "TASK",
        "parent": "NODE_UQ9irg3DmXkyhfmpzfaEn",
        "tags": [
            "TASK",
            "NODE_UQ9irg3DmXkyhfmpzfaEn"
        ]
    },
    {
        "id": "TEMP_3BBNp",
        "text": "Snippets and Backlinks nice",
        "data": {
            "lastEditedBy": "7b73e65a-3745-45fc-8cb0-fce6b54197bd",
            "updatedAt": 1677063721693
        },
        "entity": "TASK",
        "parent": "NODE_UQ9irg3DmXkyhfmpzfaEn",
        "tags": [
            "TASK",
            "NODE_UQ9irg3DmXkyhfmpzfaEn"
        ]
    }
]
 *
 */

/**
 * Todo list
 * The list view for tasks
 */
const ListView: React.FC<ViewRendererProps> = (props) => {
  // const nodeTodos = useTodoStore((store) => store.todos)
  const currentFilters = useFilterStore((store) => store.currentFilters)
  const globalJoin = useFilterStore((store) => store.globalJoin)
  const sortType = useFilterStore((store) => store.sortType)
  const groupBy = useFilterStore((store) => store.groupBy)
  const sortOrder = useFilterStore((store) => store.sortOrder)
  const [results, setResults] = useState({})
  const { queryIndex } = useSearch()

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
    queryIndex('node', [{ query: [{ type: 'text', value: '' }], type: 'query' }]).then((res) => {
      console.log('RES', groupByKey(res, 'entity'))
      setResults(groupByKey(res, groupBy))
    })
  }, [props.viewId])

  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null)

  const { enableShortcutHandler } = useEnableShortcutHandler()
  const isModalOpen = useModalStore((store) => store.open)

  // const { changeStatus, changePriority } = useTodoKanban()

  const isPreviewEditors = useMultipleEditors((store) => store.editors)

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

  if (!Object.values(results)?.flat(1)?.length)
    return <TaskListWrapper>No Results Found {props.viewId}</TaskListWrapper>

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
