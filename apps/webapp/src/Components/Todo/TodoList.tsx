import React, { useEffect, useMemo, useRef } from 'react'

import { KeyBindingMap, tinykeys } from '@workduck-io/tinykeys'

import { PriorityType, TodoType } from '@mexit/core'
import { TaskListWrapper } from '@mexit/shared'

import { useTodoFilterStore } from '../../Hooks/todo/useTodoFilters'
import { TodoKanbanCard, useTodoKanban } from '../../Hooks/todo/useTodoKanban'
import { useTodoList } from '../../Hooks/todo/useTodoList'
import { useEnableShortcutHandler } from '../../Hooks/useChangeShortcutListener'
import useMultipleEditors from '../../Stores/useEditorsStore'
import useModalStore from '../../Stores/useModalStore'
import { useTodoStore } from '../../Stores/useTodoStore'

import { RenderBoardTask } from './BoardTask'

/**
 * Todo list
 * The list view for tasks
 */
const TodoList = () => {
  const nodeTodos = useTodoStore((store) => store.todos)
  const currentFilters = useTodoFilterStore((store) => store.currentFilters)
  const globalJoin = useTodoFilterStore((store) => store.globalJoin)
  const sortType = useTodoFilterStore((store) => store.sortType)
  const sortOrder = useTodoFilterStore((store) => store.sortOrder)

  const { getList } = useTodoList()

  // Recalculate the list when filters change
  const list = useMemo(
    () => getList(nodeTodos, currentFilters, globalJoin, sortOrder, sortType),
    [nodeTodos, currentFilters, globalJoin, sortType, sortOrder]
  )
  const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null)

  const { enableShortcutHandler } = useEnableShortcutHandler()
  const isModalOpen = useModalStore((store) => store.open)
  // const sidebar = useLayoutStore((store) => store.sidebar)

  const { changeStatus, changePriority } = useTodoKanban()

  const selectedRef = useRef<HTMLDivElement>(null)
  const isPreviewEditors = useMultipleEditors((store) => store.editors)

  const todosArray = useMemo(() => Object.values(nodeTodos).flat(), [nodeTodos])

  const getTodoFromCard = (card: TodoKanbanCard): TodoType => {
    return todosArray.find((todo) => todo.nodeid === card.nodeid && todo.id === card.todoid)
  }

  const selectFirst = () => {
    const firstCard = list.length > 0 && list[0]
    if (firstCard) {
      setSelectedCardId(firstCard.id)
    }
  }

  const changeSelectedPriority = (priority: PriorityType) => {
    if (!selectedCardId) return
    const selectedCard = list.find((card) => card.id === selectedCardId)
    const todoFromCard = getTodoFromCard(selectedCard)
    changePriority(todoFromCard, priority)
  }

  const selectedIndex = useMemo(() => list.findIndex((card) => card.id === selectedCardId), [selectedCardId, list])

  const selectNewCard = (direction: 'up' | 'down') => {
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
          // mog('selected card', { selectedCard, prevCard })
          setSelectedCardId(prevCard.id)
        }
        break
      }

      case 'down': {
        const nextCard = list[(selectedIndex + 1) % list.length]
        // mog('nextCard', { nextCard, selectedColumn, selectedColumnLength, selectedIndex })
        if (nextCard) {
          // mog('selected card', { selectedCard, nextCard })
          setSelectedCardId(nextCard.id)
        }
        break
      }
    }
  }

  useEffect(() => {
    if (selectedRef.current) {
      const el = selectedRef.current
      // is element in viewport
      const rect = el.getBoundingClientRect()
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)

      // mog('scroll to selected', { selected, top, isInViewport, rect })
      if (!isInViewport) {
        selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [selectedCardId])

  const eventWrapper = (fn: (event) => void): ((event) => void) => {
    return (e) => {
      console.log('event', { e })
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
          if (selectedCardId) setSelectedCardId(null)
        },

        ArrowDown: () => selectNewCard('down'),
        ArrowUp: () => selectNewCard('up'),

        '$mod+1': () => changeSelectedPriority(PriorityType.low),
        '$mod+2': () => changeSelectedPriority(PriorityType.medium),
        '$mod+3': () => changeSelectedPriority(PriorityType.high),
        '$mod+0': () => changeSelectedPriority(PriorityType.noPriority)

        // '$mod+Enter': () => onNavigateToNode()
      })
    }

    if (!isPreviewEditors || (isPreviewEditors && !Object.entries(isPreviewEditors).length)) {
      const unsubscribe = tinykeys(window, shorcutConfig())

      return () => {
        unsubscribe()
      }
    }
  }, [list, selectedCardId, isModalOpen, isPreviewEditors])

  return (
    <TaskListWrapper>
      {list.map((todoCard) => (
        <div key={todoCard.id}>
          <RenderBoardTask
            selectedCardId={selectedCardId}
            selectedRef={selectedRef}
            id={todoCard.id}
            todoid={todoCard.todoid}
            nodeid={todoCard.nodeid}
          />
        </div>
      ))}
    </TaskListWrapper>
  )
}

export default TodoList
