import { getUntitledDraftKey, getUntitledKey, mog, NodeEditorContent } from '@mexit/core'

import { useNavigation } from './useNavigation'
import { useNewNodes } from './useNewNodes'

export type NewNoteOptions = {
  path?: string
  parent?: string
  noteId?: string
  noteContent?: NodeEditorContent
  openedNotePath?: string
  noRedirect?: boolean
}

export const useCreateNewNote = () => {
  const { push } = useNavigation()
  const { addNodeOrNodesFast } = useNewNodes()

  const createNewNote = (options?: NewNoteOptions) => {
    const newNodeId = options?.parent ? getUntitledKey(options.parent) : getUntitledDraftKey()

    const { id } = addNodeOrNodesFast(newNodeId, true, options?.parent)
    mog('CreateNewNodeRightClick', { newNodeId, parent, nodeid: id })
    push(id, { withLoading: false })

    return id
  }

  return { createNewNote }
}
