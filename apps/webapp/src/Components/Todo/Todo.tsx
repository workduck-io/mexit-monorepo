import React, { useEffect, useMemo, useState } from 'react'

import { getNextStatus, PriorityDataType, PriorityType, TodoStatus, TodoType, useTodoStore } from '@mexit/core'
import { CheckBoxWrapper, MexIcon, StyledTodoStatus, TodoContainer, TodoOptions, TodoText } from '@mexit/shared'

import useUpdateBlock from '../../Editor/Hooks/useUpdateBlock'

import PrioritySelect from './PrioritySelect'

export interface TodoControls {
  onDeleteClick?: (todoid: string) => void
  onChangeStatus?: (todoid: string, status: TodoStatus, element?: any) => void
  onChangePriority?: (todoid: string, priority: PriorityType, element?: any) => void
  getTodo?: (parentNodeId: string, todoId: string) => TodoType
}

interface TodoProps {
  parentNodeId: string
  element?: any
  todoid: string
  oid?: string
  controls?: TodoControls
  children?: React.ReactNode

  /** Is the task readonly */
  readOnly?: boolean

  /** Is the content of the task being rendered readonly in contentEditable */
  readOnlyContent?: boolean

  showOptions?: boolean

  showDelete?: boolean

  // If not set, assumed to be false or if the priority doesn't exist
  showPriority?: boolean
}

export const TodoBase = ({
  parentNodeId,
  element,
  todoid,
  children,
  readOnly,
  readOnlyContent = false,
  oid,
  showOptions = true,
  controls,
  showDelete = true,
  showPriority = false
}: TodoProps) => {
  // mog('Todo', { parentNodeId, todoid, readOnly })

  const [animate, setAnimate] = useState(false)
  const { insertInEditor } = useUpdateBlock()

  const updatePriority = useTodoStore((store) => store.updatePriorityOfTodo)
  const updateStatus = useTodoStore((store) => store.updateStatusOfTodo)
  const getTodoFromStore = useTodoStore((store) => store.getTodoOfNode)
  const todos = useTodoStore((store) => store.todos)

  const todo = useMemo(() => {
    return controls && controls.getTodo
      ? controls.getTodo(parentNodeId, todoid)
      : getTodoFromStore(parentNodeId, todoid)
  }, [parentNodeId, todoid, animate, todos])

  useEffect(() => {
    if (animate) setAnimate(false)
  }, [animate])

  const onPriorityChange = (priority: PriorityDataType) => {
    if (controls && controls.onChangePriority) {
      controls.onChangePriority(todoid, priority.type, element)
    } else {
      element && insertInEditor(element, { priority: priority.type })
      updatePriority(parentNodeId, todoid, priority.type)
    }
    setAnimate(true)
  }

  const changeStatus = (e) => {
    e.stopPropagation()

    if (readOnly) return
    const nextStatus = getNextStatus(todo.metadata.status)

    if (controls && controls.onChangeStatus) controls.onChangeStatus(todoid, nextStatus, element)
    else {
      element && insertInEditor(element, { status: nextStatus })
      updateStatus(parentNodeId, todoid, nextStatus)
    }
    setAnimate(true)
  }

  return (
    <TodoContainer
      key={`BasicTodo_${todo.nodeid}_${todo.id}_${oid}`}
      id="mexit-todo-container"
      checked={todo?.metadata.status === TodoStatus.completed}
    >
      <CheckBoxWrapper id={`TodoStatusFor_${todo.id}_${oid}`} contentEditable={false}>
        <StyledTodoStatus
          animate={animate}
          status={todo.metadata.status}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={changeStatus}
        />
      </CheckBoxWrapper>

      <TodoText contentEditable={!readOnlyContent} suppressContentEditableWarning>
        {children}
      </TodoText>
      <TodoOptions id={`TodoOptionsFor_${oid}_${todoid}`} contentEditable={false}>
        {showOptions && showDelete && (
          <MexIcon
            onClick={() => {
              controls.onDeleteClick && controls.onDeleteClick(todo.id)
            }}
            icon="codicon:trash"
            cursor="pointer"
            $noHover
            className="delete"
            margin="0"
            fontSize={20}
          />
        )}

        {(showOptions || (todo.metadata.priority !== PriorityType.noPriority && showPriority)) && (
          <PrioritySelect
            readOnly={readOnly}
            isVisible={element || (todo.metadata.priority !== PriorityType.noPriority && showPriority)}
            value={todo.metadata.priority}
            onPriorityChange={onPriorityChange}
          />
        )}
      </TodoOptions>
    </TodoContainer>
  )
}
