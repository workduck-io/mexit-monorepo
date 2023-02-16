import { RenderBoardTask } from '../../Todo/BoardTask'

const TodoRenderer = ({ selectedBlockId, block }) => {
  return (
    <RenderBoardTask selectedCardId={selectedBlockId} id={block?.id} todoid={block?.id} nodeid={block?.doc?.parent} />
  )
}

export default TodoRenderer
