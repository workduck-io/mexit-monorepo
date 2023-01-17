import { TodosType } from '@mexit/core'
import { TaskListWrapper } from '@mexit/shared'

import { useTodoList } from '../../Hooks/todo/useTodoList'

import { RenderBoardTask } from './BoardTask'

interface TodoListProps {
  todos: TodosType
}

/**
 * Todo list
 * The list view for tasks
 */
const TodoList = ({ todos }: TodoListProps) => {
  const { getList } = useTodoList()

  // Recalculate the list when filters change
  const list = getList(todos)

  return (
    <TaskListWrapper>
      {list.map((todo) => (
        <div key={todo.id}>
          <RenderBoardTask id={todo.id} todo={todo} />
        </div>
      ))}
    </TaskListWrapper>
  )
}

export default TodoList
