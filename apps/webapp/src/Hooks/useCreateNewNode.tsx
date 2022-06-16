import { getUntitledDraftKey, getUntitledKey, mog } from '@mexit/core'
import { useNavigation } from './useNavigation'
import { useNewNodes } from './useNewNodes'

export const useCreateNewNode = () => {
  const { push } = useNavigation()
  const { addNodeOrNodes } = useNewNodes()

  const createNewNode = async (parent?: string) => {
    const newNodeId = parent !== undefined ? getUntitledKey(parent) : getUntitledDraftKey()

    const node = await addNodeOrNodes(newNodeId, true, parent)
    mog('CreateNewNodeRightClick', { newNodeId, parent, node })
    push(node.id, { withLoading: false })

    return node.id
  }

  return { createNewNode }
}
