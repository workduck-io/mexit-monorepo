import React, { useEffect, useMemo, useRef } from 'react'

import Board from '@asseinfo/react-kanban'
import { useMediaQuery } from 'react-responsive'
import { useMatch } from 'react-router-dom'

import { tinykeys } from '@workduck-io/tinykeys'

import { capitalize, getNextStatus, getPrevStatus, mog, PriorityType, TodoStatus, TodoType } from '@mexit/core'
import {
  StyledTasksKanban,
  TaskCard,
  TaskColumnHeader,
  Heading,
  PageContainer,
  OverlaySidebarWindowWidth
} from '@mexit/shared'
import { ColumnHeaderProps, ItemProps, Kanban, Title } from '@workduck-io/mex-components'

import TaskHeader from '../Components/TaskHeader'
import { TodoBase as Todo } from '../Components/Todo/Todo'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useNavigation } from '../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../Hooks/useRouting'
import { useEnableShortcutHandler } from '../Hooks/useShortcutListener'
import { useSyncTaskViews, useViewStore } from '../Hooks/useTaskViews'
import { TodoKanbanCard, useTodoKanban, KanbanBoardColumn, getPureContent } from '../Hooks/useTodoKanban'
import { useLayoutStore } from '../Stores/useLayoutStore'
import useModalStore, { ModalsType } from '../Stores/useModalStore'
import { useTodoStore } from '../Stores/useTodoStore'
import SearchFilters from './SearchFilters'
import useMultipleEditors from '../Stores/useEditorsStore'

function getStyle(provided: any, style?: Record<string, unknown>) {
  if (!style) {
    return provided.draggableProps.style
  }

  return {
    ...provided.draggableProps.style,
    ...style
  }
}

const RenderCard = React.memo<ItemProps>((props: ItemProps) => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  // const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })
  // const getTodo = useTodoStore((store) => store.getTodoOfNode)
  const { item, recal, isDragging, isGroupedOver, provided, style, index } = props
  const todo = useMemo(() => {
    const [nodeid, todoid] = item.id.split('#')
    return useTodoStore.getState().getTodoOfNode(nodeid, todoid)
  }, [item.id])
  const pC = useMemo(() => getPureContent(todo), [todo])

  const controls = useMemo(
    () => ({
      onChangePriority: (todoId: string, priority) => {
        // changePriority(todo, priority)
      },
      onChangeStatus: (todoId: string, status) => {
        // changeStatus(todo, status)
      }
    }),
    []
  )

  // mog('RENDER CARD', { item, todo, pC, style })

  const toggleModal = useModalStore((store) => store.toggleOpen)

  return (
    <TaskCard
      ref={provided.innerRef}
      selected={false}
      dragging={isDragging}
      sidebarExpanded={sidebar.show && sidebar.expanded}
      onMouseDown={(event) => {
        event.preventDefault()
        if (event.detail === 2) {
          toggleModal(ModalsType.previewNote, { noteId: todo.nodeid, blockId: todo.id })
        }
      }}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={item.id}
      data-index={index}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Todo
        showDelete={false}
        key={`TODO_PREVIEW_${todo.nodeid}_${todo.id}`}
        todoid={todo.id}
        oid={'KanbanEJipir'}
        readOnly
        controls={controls}
        parentNodeId={todo.nodeid}
      >
        {/* JSON.stringify(pC)*/}
        <EditorPreviewRenderer
          noStyle
          content={pC}
          editorId={`NodeTodoPreviewKanban_${todo.nodeid}_${todo.id}_${todo.metadata.status}`}
        />
      </Todo>
    </TaskCard>
  )
})

const RenderColumnHeader = ({ columnId }: ColumnHeaderProps) => {
  return <Title>{capitalize(columnId)}</Title>
}

const Tasks = () => {
  const [selectedCard, setSelectedCard] = React.useState<TodoKanbanCard | null>(null)
  const nodesTodo = useTodoStore((store) => store.todos)
  // const clearTodos = useTodoStore((store) => store.clearTodos)
  const sidebar = useLayoutStore((store) => store.sidebar)
  const match = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const currentView = useViewStore((store) => store.currentView)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { enableShortcutHandler } = useEnableShortcutHandler()
  const isModalOpen = useModalStore((store) => store.open)

  const { goTo } = useRouting()

  const { push } = useNavigation()

  const todos = useMemo(() => Object.entries(nodesTodo), [nodesTodo])

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  const {
    getTodoBoard,
    changeStatus,
    changePriority,
    addCurrentFilter,
    changeCurrentFilter,
    removeCurrentFilter,
    resetCurrentFilters,
    setCurrentFilters,
    filters,
    currentFilters,
    globalJoin,
    setGlobalJoin
  } = useTodoKanban()

  const board = useMemo(() => getTodoBoard(), [])

  const selectedRef = useRef<HTMLDivElement>(null)
  const isPreviewEditors = useMultipleEditors((store) => store.editors)
  // const handleCardMove = (card, source, destination) => {
  //   // mog('card moved', { card, source, destination })
  //   changeStatus(card.todo, destination.toColumnId)
  // }

  // const onClearClick = () => {
  //   clearTodos()
  // }

  const onNavigateToNode = () => {
    if (!selectedCard) {
      return
    }
    const nodeid = selectedCard.todo.nodeid
    push(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
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

  useSyncTaskViews()

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

  useEffect(() => {
    const shorcutConfig = () => {
      if (isModalOpen !== undefined) return {}

      return {
        Escape: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            if (selectedCard) {
              setSelectedCard(null)
            }
            // else {
            // mog('LOAD NODE')
            // // const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
            // // loadNode(nodeid)
            // // goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
            // }
          })
        },

        'Shift+ArrowRight': (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            handleCardMoveNext()
          })
        },

        'Shift+ArrowLeft': (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            handleCardMovePrev()
          })
        },

        ArrowRight: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            selectNewCard('right')
          })
        },

        ArrowLeft: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            selectNewCard('left')
          })
        },
        ArrowDown: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            selectNewCard('down')
          })
        },

        ArrowUp: (event) => {
          enableShortcutHandler(() => {
            event.preventDefault()
            selectNewCard('up')
          })
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
      }
    }

    if (!isPreviewEditors || (isPreviewEditors && !Object.entries(isPreviewEditors).length)) {
      const unsubscribe = tinykeys(window, shorcutConfig())

      return () => {
        unsubscribe()
      }
    }
  }, [board, selectedCard, isModalOpen, isPreviewEditors])

  useEffect(() => {
    if (match && match.params && match.params.viewid) {
      // const viewid = match.params.viewid
      // loadView(viewid)
      if (currentView) {
        setCurrentFilters(currentView.filters)
        setGlobalJoin(currentView.globalJoin)
      }
      // goTo(ROUTE_PATHS.view, NavigationType.push, viewid)
    } else {
      setCurrentView(undefined)
      setCurrentFilters([])
    }
  }, [match])

  // mog('board', { board })

  return (
    <PageContainer>
      <StyledTasksKanban sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}>
        <TaskHeader
          currentFilters={currentFilters}
          cardSelected={!!selectedCard}
          currentView={currentView}
          globalJoin={globalJoin}
        />
        <SearchFilters
          result={board}
          addCurrentFilter={addCurrentFilter}
          removeCurrentFilter={removeCurrentFilter}
          changeCurrentFilter={changeCurrentFilter}
          resetCurrentFilters={resetCurrentFilters}
          filters={filters}
          currentFilters={currentFilters}
          globalJoin={globalJoin}
          setGlobalJoin={setGlobalJoin}
        />
        <Kanban
          items={board}
          RenderItem={RenderCard}
          kanbanHeight={'calc(100vh - 240px)'}
          getColumnKeys={() => [TodoStatus.todo, TodoStatus.pending, TodoStatus.completed]}
          virtualizerOptions={{ overscan: 10 }}
          RenderColumnHeader={RenderColumnHeader}
        />
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
