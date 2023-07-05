import { RenderBoardTask } from '../../Todo/BoardTask'

const TodoRenderer = ({ selectedBlockId, block }) => {
  if (!block?.id) return

  return <RenderBoardTask selectedCardId={selectedBlockId} id={block?.id} todoid={block?.id} nodeid={block?.parent} block={block}/>
}

export default TodoRenderer
