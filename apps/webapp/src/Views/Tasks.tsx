import Board from '@asseinfo/react-kanban'
import trashIcon from '@iconify/icons-codicon/trash'
import { Icon } from '@iconify/react'
import React, { useEffect, useMemo, useRef } from 'react'
import arrowLeftRightLine from '@iconify/icons-ri/arrow-left-right-line'
import dragMove2Fill from '@iconify/icons-ri/drag-move-2-fill'
import tinykeys from 'tinykeys'
import { IpcAction, getNextStatus, getPrevStatus, PriorityType, TodoType, mog } from '@mexit/core'
import { PageContainer, Button, Heading } from '@mexit/shared'
import Infobox from '../Components/Infobox'
import { DisplayShortcut, ShortcutMid } from '../Components/Shortcuts'
import { TasksHelp } from '../Data/defaultText'
import { AppType } from '../Hooks/useInitialize'
import useLoad from '../Hooks/useLoad'
import { useNavigation } from '../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../Hooks/useRouting'
import useDataStore from '../Stores/useDataStore'
import useEditorStore from '../Stores/useEditorStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import useTodoStore from '../Stores/useTodoStore'
import { Title } from '../Style/Elements'
import SearchFilters from './SearchFilters'
import { TodoKanbanCard, useTodoKanban, KanbanBoardColumn } from '../Hooks/useTodoKanban'
import { ShortcutToken, ShortcutTokens, StyledTasksKanban, TaskCard, TaskColumnHeader, TaskHeader } from '../Style/Todo'
import EditorPreviewRenderer from '../Components/EditorPreviewRenderer'
import { TodoBase } from '../Components/Todo/Todo'

const Tasks = () => {
  const [selectedCard, setSelectedCard] = React.useState<TodoKanbanCard | null>(null)
  const nodesTodo = useTodoStore((store) => store.todos)
  const clearTodos = useTodoStore((store) => store.clearTodos)

  const { loadNode } = useLoad()
  const { goTo } = useRouting()

  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const nodeUID = useEditorStore((store) => store.node.nodeid)
  const baseNodeId = useDataStore((store) => store.baseNodeId)

  const { push } = useNavigation()

  const todos = useMemo(() => Object.entries(nodesTodo), [nodesTodo])

  console.log('todos', nodesTodo)

  const {
    getTodoBoard,
    changeStatus,
    changePriority,
    getPureContent,
    addCurrentFilter,
    removeCurrentFilter,
    resetCurrentFilters,
    resetFilters,
    filters,
    currentFilters
  } = useTodoKanban()

  const board = useMemo(() => getTodoBoard(), [nodesTodo, currentFilters])

  const selectedRef = useRef<HTMLDivElement>(null)
  const handleCardMove = (card, source, destination) => {
    // mog('card moved', { card, source, destination })
    changeStatus(card.todo, destination.toColumnId)
  }

  const onClearClick = () => {
    clearTodos()
  }

  const onNavigateToNode = () => {
    if (!selectedCard) {
      return
    }
    const nodeid = selectedCard.todo.nodeid
    push(nodeid)
    // appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)
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
    const newStatus = getNextStatus(selectedCard.todo.metadata.status)
    changeStatus(selectedCard.todo, newStatus)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, metadata: { ...selectedCard.todo.metadata, status: newStatus } }
    })
  }

  const handleCardMovePrev = () => {
    if (!selectedCard) return
    const newStatus = getPrevStatus(selectedCard.todo.metadata.status)
    // mog('new status', { newStatus, selectedCard })
    changeStatus(selectedCard.todo, newStatus)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, metadata: { ...selectedCard.todo.metadata, status: newStatus } }
    })
  }

  const changeSelectedPriority = (priority: PriorityType) => {
    if (!selectedCard) return
    changePriority(selectedCard.todo, priority)
    setSelectedCard({
      ...selectedCard,
      todo: { ...selectedCard.todo, metadata: { ...selectedCard.todo.metadata, priority } }
    })
  }

  const selectNewCard = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedCard) {
      selectFirst()
      return
    }
    const selectedColumn = board.columns.find(
      (column) => column.id === selectedCard.todo.metadata.status
    ) as KanbanBoardColumn
    const selectedColumnLength = selectedColumn.cards.length
    const selectedIndex = selectedColumn.cards.findIndex((card) => card.id === selectedCard.id)

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
      case 'left': {
        let selectedColumnStatus = selectedColumn.id
        let prevCard = undefined
        while (!prevCard) {
          const prevColumn = board.columns.find(
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

  const isOnSearchFilter = () => {
    const fElement = document.activeElement as HTMLElement
    // mog('fElement', { hasClass: fElement.classList.contains('FilterInput') })
    return fElement && fElement.tagName === 'INPUT' && fElement.classList.contains('FilterInput')
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        if (selectedCard || currentFilters.length > 0) {
          setSelectedCard(null)
          resetCurrentFilters()
        } else {
          const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
          loadNode(nodeid)
          goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
        }
      },
      'Shift+ArrowRight': (event) => {
        event.preventDefault()
        handleCardMoveNext()
      },
      'Shift+ArrowLeft': (event) => {
        event.preventDefault()
        handleCardMovePrev()
      },
      ArrowRight: (event) => {
        event.preventDefault()
        if (isOnSearchFilter()) return
        selectNewCard('right')
      },
      ArrowLeft: (event) => {
        event.preventDefault()
        if (isOnSearchFilter()) return
        selectNewCard('left')
      },
      ArrowDown: (event) => {
        event.preventDefault()
        if (isOnSearchFilter()) return
        selectNewCard('down')
      },

      ArrowUp: (event) => {
        event.preventDefault()
        if (isOnSearchFilter()) return
        selectNewCard('up')
      },

      '$mod+1': (event) => {
        event.preventDefault()
        changeSelectedPriority(PriorityType.low)
      },
      '$mod+2': (event) => {
        event.preventDefault()
        changeSelectedPriority(PriorityType.medium)
      },
      '$mod+3': (event) => {
        event.preventDefault()
        changeSelectedPriority(PriorityType.high)
      },
      '$mod+0': (event) => {
        event.preventDefault()
        changeSelectedPriority(PriorityType.noPriority)
      },

      '$mod+Enter': (event) => {
        event.preventDefault()
        onNavigateToNode()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [board, selectedCard])

  const onDoubleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, nodeid: string) => {
    event.preventDefault()
    //double click
    mog('double click', { event })
    if (event.detail === 2) {
      push(nodeid)
      // appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, nodeid)
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    }
  }

  mog('Tasks', { nodesTodo, board, selectedCard })

  const RenderCard = ({ id, todo }: { id: string; todo: TodoType }, { dragging }: { dragging: boolean }) => {
    const pC = getPureContent(todo)
    mog('RenderTodo', { id, todo, dragging })

    return (
      <TaskCard
        ref={selectedCard && id === selectedCard.id ? selectedRef : null}
        selected={selectedCard && selectedCard.id === id}
        dragging={dragging}
        onMouseDown={(event) => {
          event.preventDefault()
          onDoubleClick(event, todo.nodeid)
        }}
      >
        <TodoBase
          showDelete={false}
          key={`TODO_PREVIEW_${todo.nodeid}_${todo.id}`}
          todoid={todo.id}
          readOnly
          parentNodeId={todo.nodeid}
        >
          <EditorPreviewRenderer
            noStyle
            content={pC}
            editorId={`NodeTodoPreview_${todo.nodeid}_${todo.id}_${todo.metadata.status}`}
          />
        </TodoBase>
      </TaskCard>
    )
  }

  return (
    <PageContainer>
      <TaskHeader>
        <Title>Tasks</Title>
        <ShortcutTokens>
          <ShortcutToken>
            Select:
            <Icon icon={dragMove2Fill} />
          </ShortcutToken>
          {selectedCard && (
            <>
              <ShortcutToken>
                Navigate:
                <DisplayShortcut shortcut="$mod+Enter" />
              </ShortcutToken>
              <ShortcutToken>
                Move:
                <DisplayShortcut shortcut="Shift" />
                <ShortcutMid>+</ShortcutMid>
                <Icon icon={arrowLeftRightLine} />
              </ShortcutToken>
              <ShortcutToken>
                Change Priority:
                <DisplayShortcut shortcut="$mod+0-3" />
              </ShortcutToken>
            </>
          )}
          <ShortcutToken>
            {selectedCard || currentFilters.length > 0 ? 'Clear Filters:' : 'Navigate to Editor:'}
            <DisplayShortcut shortcut="Esc" />
          </ShortcutToken>
        </ShortcutTokens>
        <Button onClick={onClearClick}>
          <Icon icon={trashIcon} height={24} />
          Clear Todos
        </Button>
        <Infobox text={TasksHelp} />
      </TaskHeader>
      <StyledTasksKanban>
        <SearchFilters
          result={board}
          addCurrentFilter={addCurrentFilter}
          removeCurrentFilter={removeCurrentFilter}
          resetCurrentFilters={resetCurrentFilters}
          filters={filters}
          currentFilters={currentFilters}
        />
        <Board
          renderColumnHeader={({ title }) => <TaskColumnHeader>{title}</TaskColumnHeader>}
          disableColumnDrag
          onCardDragEnd={handleCardMove}
          renderCard={RenderCard}
        >
          {board}
        </Board>
      </StyledTasksKanban>
      {todos.length < 1 && (
        <div>
          <Heading>No Todos</Heading>
          <p>Use the Editor to add Todos to your nodes. All todos will show up here.</p>
          <p>
            You can add todos with
            <kbd>[]</kbd>
          </p>
          {/* HTML element for keyboard shortcut */}
        </div>
      )}
    </PageContainer>
  )
}

export default Tasks
