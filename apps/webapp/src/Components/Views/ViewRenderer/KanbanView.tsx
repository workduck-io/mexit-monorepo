import React, { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useMediaQuery } from 'react-responsive'

import Board from '@asseinfo/react-kanban'

import { KeyBindingMap, tinykeys } from '@workduck-io/tinykeys'

import { getNextStatus, getPrevStatus, PriorityType, TodoType } from '@mexit/core'
import { OverlaySidebarWindowWidth, StyledTasksKanban, TaskColumnHeader } from '@mexit/shared'

import { useTodoFilters } from '../../../Hooks/todo/useTodoFilters'
import { KanbanBoardColumn, TodoKanbanCard, useTodoKanban } from '../../../Hooks/todo/useTodoKanban'
import { useEnableShortcutHandler } from '../../../Hooks/useChangeShortcutListener'
import { useNavigation } from '../../../Hooks/useNavigation'
import { isReadonly, usePermissions } from '../../../Hooks/usePermissions'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import useMultipleEditors from '../../../Stores/useEditorsStore'
import { useLayoutStore } from '../../../Stores/useLayoutStore'
import useModalStore from '../../../Stores/useModalStore'
import { useTodoStore } from '../../../Stores/useTodoStore'
import { RenderBoardTask } from '../../Todo/BoardTask'

/**
 * TodoKanban
 * Kanban view for todo
 * With shortcuts and navigation
 */
const KanbanView = () => {
  const [selectedCard, setSelectedCard] = React.useState<TodoKanbanCard | null>(null)

  const nodesTodo = useTodoStore((store) => store.todos)

  const { enableShortcutHandler } = useEnableShortcutHandler()
  const isModalOpen = useModalStore((store) => store.open)
  const sidebar = useLayoutStore((store) => store.sidebar)

  const { getTodoBoard, changeStatus, changePriority } = useTodoKanban()
  const { globalJoin, currentFilters, sortOrder, sortType } = useTodoFilters()

  const { push } = useNavigation()
  const { goTo } = useRouting()

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })
  const { accessWhenShared } = usePermissions()

  const board = useMemo(() => getTodoBoard(), [nodesTodo, globalJoin, currentFilters, sortOrder, sortType])

  const isPreviewEditors = useMultipleEditors((store) => store.editors)

  const todosArray = useMemo(() => Object.values(nodesTodo).flat(), [nodesTodo])
  const getTodoFromCard = (card: TodoKanbanCard): TodoType => {
    return todosArray.find((todo) => todo.nodeid === card.nodeid && todo.id === card.todoid)
  }

  const handleCardMove = (card, source, destination) => {
    const todoFromCard = getTodoFromCard(card)
    const readOnly = todoFromCard?.nodeid && isReadonly(accessWhenShared(todoFromCard?.nodeid))
    // mog('card moved', { card, source, destination, readOnly })
    if (!readOnly) {
      // mog('new status', { newStatus, todoFromCard, selectedCard })
      changeStatus(todoFromCard, destination.toColumnId)
    } else {
      toast('Cannot move task in a note with Read only permission')
    }
  }

  const onNavigateToNode = () => {
    if (!selectedCard) {
      return
    }
    const nodeid = selectedCard.nodeid
    push(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const selectFirst = () => {
    const firstCardColumn = board.columns.find((column) => column.cards.length > 0)
    if (firstCardColumn) {
      if (firstCardColumn.cards) {
        const firstCard = firstCardColumn.cards[0]
        setSelectedCard(firstCard)
      }
    }
  }

  const handleCardMoveNext = () => {
    if (!selectedCard) return
    const todoFromCard = getTodoFromCard(selectedCard)
    const newStatus = getNextStatus(todoFromCard.metadata.status)
    changeStatus(todoFromCard, newStatus)
  }

  const handleCardMovePrev = () => {
    if (!selectedCard) return
    const todoFromCard = getTodoFromCard(selectedCard)
    const newStatus = getPrevStatus(todoFromCard.metadata.status)
    // mog('new status', { newStatus, todoFromCard, selectedCard })
    changeStatus(todoFromCard, newStatus)
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

    const selectedColumn = board.columns.find((column) => column.id === selectedCard.status) as KanbanBoardColumn
    const selectedColumnLength = selectedColumn.cards.length
    const selectedIndex = selectedColumn.cards.findIndex(
      (card) => card.todoid === selectedCard.todoid && card.nodeid === selectedCard.nodeid
    )

    // mog('selected card', { selectedCard, selectedColumn, selectedColumnLength, selectedIndex, direction })

    switch (direction) {
      case 'up': {
        const prevCard = selectedColumn.cards[(selectedIndex - 1 + selectedColumnLength) % selectedColumnLength]

        if (prevCard) {
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

      case 'left': {
        let selectedColumnStatus = selectedColumn.id
        let prevCard = undefined
        while (!prevCard) {
          const prevColumn = board.columns.find(
            // eslint-disable-next-line no-loop-func
            (column) => column.id === getPrevStatus(selectedColumnStatus)
          ) as KanbanBoardColumn
          if (!prevColumn || prevColumn.id === selectedColumn.id) break
          prevCard = prevColumn.cards[selectedIndex % prevColumn.cards.length]
          selectedColumnStatus = prevColumn.id
        }
        if (prevCard) {
          // mog('selected card', { selectedCard, prevCard })
          setSelectedCard(prevCard)
        }
        break
      }

      case 'right': {
        let selectedColumnStatus = selectedColumn.id
        let nextCard = undefined
        while (!nextCard) {
          const nextColumn = board.columns.find(
            // eslint-disable-next-line no-loop-func
            (column) => column.id === getNextStatus(selectedColumnStatus)
          ) as KanbanBoardColumn
          if (!nextColumn || nextColumn.id === selectedColumn.id) break
          nextCard = nextColumn.cards[selectedIndex % nextColumn.cards.length]
          selectedColumnStatus = nextColumn.id
        }
        if (nextCard) {
          // mog('selected card', { selectedCard, nextCard })
          setSelectedCard(nextCard)
        }
        break
      }
    }
  }

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

        'Shift+ArrowRight': () => handleCardMoveNext(),
        'Shift+ArrowLeft': () => handleCardMovePrev(),

        ArrowRight: () => selectNewCard('right'),
        ArrowLeft: () => selectNewCard('left'),
        ArrowDown: () => selectNewCard('down'),
        ArrowUp: () => selectNewCard('up'),

        '$mod+1': () => changeSelectedPriority(PriorityType.low),
        '$mod+2': () => changeSelectedPriority(PriorityType.medium),
        '$mod+3': () => changeSelectedPriority(PriorityType.high),
        '$mod+0': () => changeSelectedPriority(PriorityType.noPriority),

        '$mod+Enter': () => onNavigateToNode()
      })
    }

    if (!isPreviewEditors || (isPreviewEditors && !Object.entries(isPreviewEditors).length)) {
      const unsubscribe = tinykeys(window, shorcutConfig())

      return () => {
        unsubscribe()
      }
    }
  }, [board, selectedCard, isModalOpen, isPreviewEditors])

  const RenderCard = (
    { id, todoid, nodeid }: { id: string; todoid: string; nodeid: string },
    { dragging }: { dragging: boolean }
  ) => {
    return (
      <RenderBoardTask
        id={id}
        todoid={todoid}
        nodeid={nodeid}
        selectedCardId={selectedCard ? selectedCard?.id : null}
        overlaySidebar={overlaySidebar}
        dragging={dragging}
      />
    )
  }
  return (
    <StyledTasksKanban sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}>
      <Board
        renderColumnHeader={({ title }) => <TaskColumnHeader>{title}</TaskColumnHeader>}
        disableColumnDrag
        onCardDragEnd={handleCardMove}
        renderCard={RenderCard}
      >
        {board}
      </Board>
    </StyledTasksKanban>
  )
}

export default KanbanView
