import { useEffect, useState } from 'react'

import Board from '@asseinfo/react-kanban'

import { TaskColumnHeader } from '@mexit/shared'

import { RenderBoardTask } from '../../../Components/Todo/BoardTask'
import { useTodoKanban } from '../../../Hooks/todo/useTodoKanban'
import { useTaskViews } from '../../../Hooks/useTaskViews'

const KanbanElement = ({ viewId, view, setView }) => {
  const [board, setBoard] = useState<any>(undefined)
  const { getFilteredTodoBoard } = useTodoKanban()
  const { getView } = useTaskViews()

  useEffect(() => {
    const filters = view?.filters
    if (filters) {
      setBoard(getFilteredTodoBoard(filters))
    }
  }, [viewId, view])

  const refreshView = () => {
    const newView = getView(viewId)
    setView(newView)
    const filters = view?.filters
    if (filters) {
      const board = getFilteredTodoBoard(filters)
      setBoard(board)
    }
  }

  const RenderCard = (
    { id, todoid, nodeid }: { id: string; todoid: string; nodeid: string },
    { dragging }: { dragging: boolean }
  ) => {
    return (
      <RenderBoardTask
        staticBoard
        refreshCallback={refreshView}
        id={id}
        todoid={todoid}
        nodeid={nodeid}
        overlaySidebar={false}
        dragging={dragging}
      />
    )
  }

  if (!board) return

  return (
    <Board
      renderColumnHeader={({ title }) => <TaskColumnHeader>{title}</TaskColumnHeader>}
      disableColumnDrag
      disableCardDrag
      renderCard={RenderCard}
    >
      {board}
    </Board>
  )
}

export default KanbanElement
