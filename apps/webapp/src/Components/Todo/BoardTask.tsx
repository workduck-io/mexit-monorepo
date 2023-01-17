import React, { useMemo } from 'react'

import { PriorityType } from '@mexit/core'
import { TaskCard } from '@mexit/shared'

import { TodoKanbanCard, useTodoKanban } from '../../Hooks/todo/useTodoKanban'
import { isReadonly, usePermissions } from '../../Hooks/usePermissions'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import useModalStore, { ModalsType } from '../../Stores/useModalStore'
import { useTodoStore } from '../../Stores/useTodoStore'
import Plateless from '../Editor/Plateless'
import { TodoBase as Todo } from '../Todo/Todo'

interface RenderTaskProps {
  id: string

  // TODO: Remove dependency on complete todo object
  // Fetch the data from the store instead and refresh the state when the store changes
  todoid: string
  nodeid: string

  /** reference to the selected card, this is set to the task card if the id match */
  selectedRef?: React.RefObject<HTMLDivElement>

  selectedCard?: TodoKanbanCard | null

  /** whether the task is in a static kanban board, for example in read only view embeds */
  staticBoard?: boolean

  /** Function to call to refresh the data in the task, after a change */
  refreshCallback?: () => void

  /** Whether the sidebar is currently overlaying the content, needed for width in kanban */
  overlaySidebar?: boolean

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
    selectedCard,
    selectedRef,
    dragging
  }: RenderTaskProps) => {
    const { changeStatus, changePriority, getPureContent } = useTodoKanban()
    const getTodoOfNode = useTodoStore((store) => store.getTodoOfNodeWithoutCreating)

    const todo = useMemo(() => getTodoOfNode(nodeid, todoid), [nodeid, todoid])
    const sidebar = useLayoutStore((store) => store.sidebar)
    const pC = useMemo(() => getPureContent(todo), [id, todo])
    const { accessWhenShared } = usePermissions()
    const readOnly = useMemo(() => isReadonly(accessWhenShared(todo?.nodeid)), [todo])

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
        ref={selectedCard && !!selectedRef && id === selectedCard.id ? selectedRef : null}
        selected={selectedCard && selectedCard?.id === id}
        dragging={dragging}
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
