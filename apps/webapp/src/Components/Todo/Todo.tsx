import React, { useEffect, useMemo, useState } from 'react'

import { getNextStatus, PriorityDataType, PriorityType, TodoStatus, TodoType } from '@mexit/core'
import { CheckBoxWrapper, MexIcon, StyledTodoStatus, TodoContainer, TodoOptions, TodoText } from '@mexit/shared'

import useUpdateBlock from '../../Editor/Hooks/useUpdateBlock'
import { useTodoStore } from '../../Stores/useTodoStore'

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
  controls,
  showDelete = true,
  showPriority = false
}: TodoProps) => {
  // mog('Todo', { parentNodeId, todoid, readOnly })
  const [showOptions, setShowOptions] = useState(false)

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
    if (controls && controls.onChangePriority) controls.onChangePriority(todoid, priority.type, element)
    else {
      updatePriority(parentNodeId, todoid, priority.type)
      element && insertInEditor(element, { priority: priority.type })
    }
    setAnimate(true)
  }

  const changeStatus = () => {
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
      id={`BasicTodo_${todo.nodeid}_${todo.id}_${oid}`}
      checked={todo?.metadata.status === TodoStatus.completed}
      onMouseEnter={() => !readOnly && setShowOptions(true)}
      onMouseLeave={() => !readOnly && setShowOptions(false)}
    >
      <CheckBoxWrapper id={`TodoStatusFor_${todo.id}_${oid}`} contentEditable={false}>
        <StyledTodoStatus animate={animate} status={todo.metadata.status} onClick={changeStatus} />
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
            className="delete"
            margin="0"
            fontSize={20}
          />
        )}
        {/*
          (showOptions || (reminder && !reminder.state.done)) && (<TodoReminder oid={oid} todoid={todo.id} nodeid={parentNodeId} content={getPureContent(todo)} />)
        */}
        {(showOptions || (todo.metadata.priority !== PriorityType.noPriority && showPriority)) && (
          <PrioritySelect
            readOnly={readOnly}
            value={todo.metadata.priority}
            onPriorityChange={onPriorityChange}
            id={todo.id}
          />
        )}
        {/* <TaskPriority background="#114a9e" transparent={0.25}>
            assignee
          </TaskPriority> */}
      </TodoOptions>
    </TodoContainer>
  )
}
