import { TaskListWrapper } from '@mexit/shared'

import { useTodoList } from '../../Hooks/todo/useTodoList'
import { useTodoStore } from '../../Stores/useTodoStore'

import { RenderBoardTask } from './BoardTask'

/**
 * Todo list
 * The list view for tasks
 */
const TodoList = () => {
  const nodeTodos = useTodoStore((store) => store.todos)
  const { getList } = useTodoList()

  // Recalculate the list when filters change
  const list = getList(nodeTodos)

  return (
    <TaskListWrapper>
      {list.map((todoCard) => (
        <div key={todoCard.id}>
          <RenderBoardTask id={todoCard.id} todoid={todoCard.todoid} nodeid={todoCard.nodeid} />
        </div>
      ))}
    </TaskListWrapper>
  )
}

export default TodoList
