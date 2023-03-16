import React, { useEffect, useMemo } from 'react'

import { ModalsType,PriorityType, useLayoutStore,useModalStore, useTodoStore  } from '@mexit/core'
import { TaskCard, ViewType } from '@mexit/shared'

import { useTodoKanban } from '../../Hooks/todo/useTodoKanban'
import { isReadonly, usePermissions } from '../../Hooks/usePermissions'
import Plateless from '../Editor/Plateless'
import { TodoBase as Todo } from '../Todo/Todo'

interface RenderTaskProps {
  id: string

  // TODO: Remove dependency on complete todo object
  // Fetch the data from the store instead and refresh the state when the store changes
  todoid: string
  nodeid: string

  selectedCardId?: string | null

  /** whether the task is in a static kanban board, for example in read only view embeds */
  staticBoard?: boolean

  /** Function to call to refresh the data in the task, after a change */
  refreshCallback?: () => void

  /** Whether the sidebar is currently overlaying the content, needed for width in kanban */
  overlaySidebar?: boolean

  viewType?: ViewType

  /** Whether the card is being dragged, styling */
  dragging?: boolean
}

export const RenderBoardTask = React.memo<RenderTaskProps>(
  ({
    id,
    todoid,
    nodeid,
    overlaySidebar,
    staticBoard,
    refreshCallback,
    selectedCardId,
    dragging,
    viewType
  }: RenderTaskProps) => {
    const { changeStatus, changePriority, getPureContent } = useTodoKanban()
    const getTodoOfNode = useTodoStore((store) => store.getTodoOfNodeWithoutCreating)
    const ref = React.useRef<HTMLDivElement>(null)

    const todo = useMemo(() => getTodoOfNode(nodeid, todoid), [nodeid, todoid])
    const sidebar = useLayoutStore((store) => store.sidebar)
    const pC = useMemo(() => getPureContent(todo), [id, todo])
    const { accessWhenShared } = usePermissions()
    const readOnly = useMemo(() => isReadonly(accessWhenShared(todo?.nodeid)), [todo])

    useEffect(() => {
      if (ref.current) {
        if (selectedCardId === id) {
          ref.current.focus()
        } else return
        const el = ref.current
        // is element in viewport
        const rect = el.getBoundingClientRect()
        const isInViewport =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)

        // mog('scroll to selected', { selected, top, isInViewport, rect })
        if (!isInViewport) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, [selectedCardId])

    const controls = useMemo(
      () => ({
        onChangePriority: (todoId: string, priority) => {
          changePriority(todo, priority)
          if (refreshCallback) refreshCallback()
        },
        onChangeStatus: (todoId: string, status) => {
          changeStatus(todo, status)
          if (refreshCallback) refreshCallback()
        }
      }),
      []
    )

    const toggleModal = useModalStore((store) => store.toggleOpen)
    const priorityShown = todo.metadata.priority !== PriorityType.noPriority

    // mog('staticBoard', { staticBoard })

    return (
      <TaskCard
        selected={selectedCardId && selectedCardId === id}
        ref={ref}
        dragging={dragging}
        viewType={viewType}
        staticBoard={staticBoard}
        sidebarExpanded={sidebar.show && sidebar.expanded && !overlaySidebar}
        priorityShown={priorityShown}
        onMouseDown={(event) => {
          if (staticBoard) return
          event.preventDefault()
          if (event.detail === 2) {
            toggleModal(ModalsType.previewNote, { noteId: todo.nodeid, blockId: todo.id })
          }
        }}
      >
        <Todo
          showDelete={false}
          key={`TODO_PREVIEW_${todo.nodeid}_${todo.id}`}
          todoid={todo.id}
          readOnly={readOnly}
          readOnlyContent
          showPriority
          controls={controls}
          parentNodeId={todo.nodeid}
        >
          {/*
          <EditorPreviewRenderer
            noStyle
            content={pC}
            editorId={`NodeTodoPreview_${todo.nodeid}_${todo.id}_${todo.metadata.status}`}
          /> */}
          <Plateless content={pC} />
        </Todo>
      </TaskCard>
    )
  }
)

RenderBoardTask.displayName = 'RenderTask'
