import { useMemo } from 'react'

import { View, ViewType } from '@mexit/core'
import { TaskListWrapper } from '@mexit/shared'

import { RenderBoardTask } from '../../../Components/Todo/BoardTask'
import { useTodoList } from '../../../Hooks/todo/useTodoList'
import { useTodoStore } from '../../../Stores/useTodoStore'

export type ListViewProps = {
  view: View
}

const TodoListElement: React.FC<ListViewProps> = ({ view }) => {
  const nodeTodos = useTodoStore((store) => store.todos)

  const { getList } = useTodoList()

  const list = useMemo(() => {
    return getList(nodeTodos, view.filters, view.globalJoin, view.sortOrder, view.sortType)
  }, [view, nodeTodos])

  return (
    <TaskListWrapper margin>
      {list.map((todoCard) => (
        <div key={todoCard.id}>
          <RenderBoardTask
            staticBoard
            id={todoCard.id}
            todoid={todoCard.todoid}
            nodeid={todoCard.nodeid}
            viewType={ViewType.List}
          />
        </div>
      ))}
    </TaskListWrapper>
  )
}

export default TodoListElement
