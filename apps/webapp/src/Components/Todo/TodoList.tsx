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
  const [selectedCard, setSelectedCard] = React.useState<TodoKanbanCard | null>(null)

  const { enableShortcutHandler } = useEnableShortcutHandler()
  const isModalOpen = useModalStore((store) => store.open)
  // const sidebar = useLayoutStore((store) => store.sidebar)

  const { changeStatus, changePriority } = useTodoKanban()
  // const { push } = useNavigation()
  // const { goTo } = useRouting()

  // const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })
  // const { accessWhenShared } = usePermissions()

  // const board = useMemo(() => getTodoBoard(), [nodesTodo, globalJoin, currentFilters, sortOrder, sortType])

  const selectedRef = useRef<HTMLDivElement>(null)
  const isPreviewEditors = useMultipleEditors((store) => store.editors)

  const todosArray = useMemo(() => Object.values(nodeTodos).flat(), [nodeTodos])
  const getTodoFromCard = (card: TodoKanbanCard): TodoType => {
    return todosArray.find((todo) => todo.nodeid === card.nodeid && todo.id === card.todoid)
  }

  const selectFirst = () => {
    // const firstCardColumn = board.columns.find((column) => column.cards.length > 0)
    // if (firstCardColumn) {
    //   if (firstCardColumn.cards) {
    //     const firstCard = firstCardColumn.cards[0]
    //     setSelectedCard(firstCard)
    //   }
    // }
  }

  const changeSelectedPriority = (priority: PriorityType) => {
    if (!selectedCard) return
    const todoFromCard = getTodoFromCard(selectedCard)
    changePriority(todoFromCard, priority)
  }

  const selectNewCard = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCard) {
      selectFirst()
      return
    }

    const selectedColumn = null // board.columns.find((column) => column.id === selectedCard.status) as KanbanBoardColumn
    const selectedColumnLength = selectedColumn.cards.length
    const selectedIndex = selectedColumn.cards.findIndex(
      (card) => card.todoid === selectedCard.todoid && card.nodeid === selectedCard.nodeid
    )

    // mog('selected card', { selectedCard, selectedColumn, selectedColumnLength, selectedIndex, direction })

    switch (direction) {
      case 'up': {
        const prevCard = selectedColumn.cards[(selectedIndex - 1 + selectedColumnLength) % selectedColumnLength]
        // mog('prevCard', { prevCard })

        if (prevCard) {
          // mog('selected card', { selectedCard, prevCard })
          setSelectedCard(prevCard)
        }
        break
      }

      case 'down': {
        const nextCard = selectedColumn.cards[(selectedIndex + 1) % selectedColumnLength]
        // mog('nextCard', { nextCard, selectedColumn, selectedColumnLength, selectedIndex })
        if (nextCard) {
          // mog('selected card', { selectedCard, nextCard })
          setSelectedCard(nextCard)
        }
        break
      }

      //       case 'left': {
      //         let selectedColumnStatus = selectedColumn.id
      //         let prevCard = undefined
      //         while (!prevCard) {
      //           const prevColumn = board.columns.find(
      //             // eslint-disable-next-line no-loop-func
      //             (column) => column.id === getPrevStatus(selectedColumnStatus)
      //           ) as KanbanBoardColumn
      //           if (!prevColumn || prevColumn.id === selectedColumn.id) break
      //           prevCard = prevColumn.cards[selectedIndex % prevColumn.cards.length]
      //           selectedColumnStatus = prevColumn.id
      //         }
      //         if (prevCard) {
      //           // mog('selected card', { selectedCard, prevCard })
      //           setSelectedCard(prevCard)
      //         }
      //         break
      //       }

      //       case 'right': {
      //         let selectedColumnStatus = selectedColumn.id
      //         let nextCard = undefined
      //         while (!nextCard) {
      //           const nextColumn = board.columns.find(
      //             // eslint-disable-next-line no-loop-func
      //             (column) => column.id === getNextStatus(selectedColumnStatus)
      //           ) as KanbanBoardColumn
      //           if (!nextColumn || nextColumn.id === selectedColumn.id) break
      //           nextCard = nextColumn.cards[selectedIndex % nextColumn.cards.length]
      //           selectedColumnStatus = nextColumn.id
      //         }
      //         if (nextCard) {
      //           // mog('selected card', { selectedCard, nextCard })
      //           setSelectedCard(nextCard)
      //         }
      //         break
      //       }
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
  }, [selectedCard])

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
          if (selectedCard) setSelectedCard(null)
        },

        // 'Shift+ArrowRight': () => handleCardMoveNext(),
        // 'Shift+ArrowLeft': () => handleCardMovePrev(),

        // ArrowRight: () => selectNewCard('right'),
        // ArrowLeft: () => selectNewCard('left'),
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
  }, [list, selectedCard, isModalOpen, isPreviewEditors])

  return (
    <TaskListWrapper>
      {list.map((todoCard) => (
        <div key={todoCard.id}>
          <RenderBoardTask id={todoCard.id} todoid={todoCard.todoid} nodeid={todoCard.nodeid} />
        </div>
      ))}
    </TaskListWrapper>
  )
}

export default TodoList
