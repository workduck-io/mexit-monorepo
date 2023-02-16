import React, { useCallback, useEffect, useState } from 'react'

import { KeyBindingMap, tinykeys } from '@workduck-io/tinykeys'

import { mog } from '@mexit/core'
import { TaskListWrapper } from '@mexit/shared'

import { useEnableShortcutHandler } from '../../../Hooks/useChangeShortcutListener'
import { useFilterStore } from '../../../Hooks/useFilters'
import { useSearch } from '../../../Hooks/useSearch'
import useMultipleEditors from '../../../Stores/useEditorsStore'
import useModalStore from '../../../Stores/useModalStore'
import ViewBlockRenderer from '../ViewBlockRenderer'

/**
 * Todo list
 * The list view for tasks
 */
const ListView = () => {
  // const nodeTodos = useTodoStore((store) => store.todos)
  const currentFilters = useFilterStore((store) => store.currentFilters)
  const globalJoin = useFilterStore((store) => store.globalJoin)
  const sortType = useFilterStore((store) => store.sortType)
  const sortOrder = useFilterStore((store) => store.sortOrder)
  const [list, setList] = useState([])

  const { queryIndex } = useSearch()

  useEffect(() => {
    queryIndex('node').then((r) => {
      console.log({ RESULT: r })
      setList(r)
    })
  }, [])

  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null)

  const { enableShortcutHandler } = useEnableShortcutHandler()
  const isModalOpen = useModalStore((store) => store.open)

  // const { changeStatus, changePriority } = useTodoKanban()

  const isPreviewEditors = useMultipleEditors((store) => store.editors)

  // const todosArray = useMemo(() => Object.values(nodeTodos).flat(), [nodeTodos])

  const selectFirst = () => {
    const firstCard = list.length > 0 && list[0]
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
          // mog('nextCard', { nextCard, selectedColumn, selectedColumnLength, selectedIndex })
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
      // console.log('event', { e })
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

  return (
    <TaskListWrapper>
      {list?.map((block) => (
        <div key={block.id}>
          <ViewBlockRenderer selectedBlockId={selectedCardId} block={block} />
        </div>
      ))}
    </TaskListWrapper>
  )
}

export default ListView
