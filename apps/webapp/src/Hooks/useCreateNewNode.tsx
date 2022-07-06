import { getUntitledDraftKey, getUntitledKey, mog, NodeEditorContent } from '@mexit/core'
import { useNavigation } from './useNavigation'
import { useNewNodes } from './useNewNodes'

export type NewNodeOptions = {
  path?: string
  parent?: string
  nodeId?: string
  nodeContent?: NodeEditorContent
  openedNodePath?: string
  noRedirect?: boolean
}

export const useCreateNewNode = () => {
  const { push } = useNavigation()
  const { addNodeOrNodesFast } = useNewNodes()

  const createNewNode = (options?: NewNodeOptions) => {
    const newNodeId = options?.parent ? getUntitledKey(options.parent) : getUntitledDraftKey()

    const { id } = addNodeOrNodesFast(newNodeId, true, options?.parent)
    mog('CreateNewNodeRightClick', { newNodeId, parent, nodeid: id })
    push(id, { withLoading: false })

    return id
  }

  return { createNewNode }
}
