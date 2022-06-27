import { getUntitledDraftKey, getUntitledKey, mog } from '@mexit/core'
import { useNavigation } from './useNavigation'
import { useNewNodes } from './useNewNodes'

export const useCreateNewNode = () => {
  const { push } = useNavigation()
  const { addNodeOrNodesFast } = useNewNodes()

  const createNewNode = (parent?: string) => {
    const newNodeId = parent !== undefined ? getUntitledKey(parent) : getUntitledDraftKey()

    const { id } = addNodeOrNodesFast(newNodeId, true, parent)
    mog('CreateNewNodeRightClick', { newNodeId, parent, nodeid: id })
    push(id, { withLoading: false })

    return id
  }

  return { createNewNode }
}
