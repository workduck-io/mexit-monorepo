import React, { useEffect, useMemo, useState } from 'react'

import { getNextStatus,PriorityDataType, PriorityType, TodoStatus, TodoType } from '@mexit/core'
import { CheckBoxWrapper, MexIcon, StyledTodoStatus, TodoContainer, TodoOptions, TodoText } from '@mexit/shared'

import { useTodoStore } from '../../../Stores/useTodoStore'
import PrioritySelect from './PrioritySelect'

export interface TodoControls {
  onDeleteClick?: (todoid: string) => void
  onChangeStatus?: (todoid: string, status: TodoStatus) => void
  onChangePriority?: (todoid: string, priority: PriorityType) => void
  getTodo?: (parentNodeId: string, todoId: string) => TodoType
}

interface TodoProps {
  parentNodeId: string
  todoid: string
  oid?: string
  controls?: TodoControls
  children?: React.ReactNode
  readOnly?: boolean
  showDelete?: boolean
}

export const TodoBase = ({ parentNodeId, todoid, children, readOnly, oid, controls, showDelete = true }: TodoProps) => {
  // mog('Todo', { parentNodeId, todoid, readOnly })
  const [showOptions, setShowOptions] = useState(false)

  const [animate, setAnimate] = useState(false)

  const updatePriority = useTodoStore((store) => store.updatePriorityOfTodo)
  const updateStatus = useTodoStore((store) => store.updateStatusOfTodo)
  const getTodoFromStore = useTodoStore((store) => store.getTodoOfNode)
  const todos = useTodoStore((store) => store.todos)

  const todo = useMemo(() => {
    return controls && controls.getTodo
      ? controls.getTodo(parentNodeId, todoid)
      : getTodoFromStore(parentNodeId, todoid)
  }, [parentNodeId, todoid, animate, todos])

  // const { getBlockReminder } = useReminders()
  // const reminder = getBlockReminder(todoid)

  useEffect(() => {
    if (animate) setAnimate(false)
  }, [animate])

  const onPriorityChange = (priority: PriorityDataType) => {
    if (controls && controls.onChangePriority) controls.onChangePriority(todoid, priority.type)
    else updatePriority(parentNodeId, todoid, priority.type)
    setAnimate(true)
  }

  const changeStatus = () => {
    if (controls && controls.onChangeStatus) controls.onChangeStatus(todoid, getNextStatus(todo.metadata.status))
    else updateStatus(parentNodeId, todoid, getNextStatus(todo.metadata.status))
    setAnimate(true)
  }

  return (
    <TodoContainer
      key={`BasicTodo_${todo.nodeid}_${todo.id}_${oid}`}
      id={`BasicTodo_${todo.nodeid}_${todo.id}_${oid}`}
      checked={todo?.metadata.status === TodoStatus.completed}
      onMouseEnter={() => {
        setShowOptions(true)
      }}
      onMouseLeave={() => setShowOptions(false)}
    >
      <CheckBoxWrapper id={`TodoStatusFor_${todo.id}_${oid}`} contentEditable={false}>
        <StyledTodoStatus animate={animate} status={todo.metadata.status} onClick={changeStatus} />
      </CheckBoxWrapper>

      <TodoText contentEditable={!readOnly} suppressContentEditableWarning>
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
            margin="0"
            fontSize={20}
          />
        )}
        {/*
          (showOptions || (reminder && !reminder.state.done)) && (<TodoReminder oid={oid} todoid={todo.id} nodeid={parentNodeId} content={getPureContent(todo)} />)
        */}
        {(showOptions || todo.metadata.priority !== PriorityType.noPriority) && (
          <PrioritySelect value={todo.metadata.priority} onPriorityChange={onPriorityChange} id={todo.id} />
        )}
        {/* <TaskPriority background="#114a9e" transparent={0.25}>
            assignee
          </TaskPriority> */}
      </TodoOptions>
    </TodoContainer>
  )
}
