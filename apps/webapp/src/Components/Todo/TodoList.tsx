import React from 'react'

import { TodosType } from '@mexit/core'
import { TaskListWrapper } from '@mexit/shared'

import { useTodoList } from '../../Hooks/todo/useTodoList'
import { RenderBoardTask } from '../../Views/Tasks'


interface TodoListProps {
  todos: TodosType
}

const TodoList = ({ todos }: TodoListProps) => {
  const { getList } = useTodoList()

  // Recalculate the list when filters change
  const list = getList(todos)

  return (
    <TaskListWrapper>
      {list.map((todo) => (
        <div key={todo.id}>
          <RenderBoardTask id={todo.id} todo={todo} overlaySidebar={false} dragging={false} />
        </div>
      ))}
    </TaskListWrapper>
  )
}

export default TodoList
