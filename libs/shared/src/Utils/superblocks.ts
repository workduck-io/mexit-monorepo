import { findNode, getPlateEditorRef, setNodes } from '@udecode/plate'

import { getNodeIdFromEditor, useAuthStore } from '@mexit/core'

export const changeSuperBlockType = (parentId: string, blockId: string, type: string) => {
  const editor = getPlateEditorRef()
  const updatedBy = useAuthStore.getState().userDetails?.id

  if (editor) {
    const noteId = getNodeIdFromEditor(parentId)
    const nodeEntry = findNode(editor, { block: true, match: { id: blockId } })

    if (nodeEntry) {
      const [element, path] = nodeEntry as any

      const metadata = element.metadata || {}
      const properties = element.properties || {}
      const entity = properties.entity || {}

      setNodes(
        editor,
        {
          metadata: {
            ...metadata,
            updatedBy,
            updatedAt: Date.now()
          },
          type,
          properties: {
            ...properties,
            entity: {
              ...entity,
              active: type
            }
          }
        },
        { at: path, mode: 'highest' }
      )
    }
  }
}
