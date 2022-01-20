import { usePlateEditorRef, deserializeHtml } from '@udecode/plate-core'
import { NodeEditorContent } from '../Types/Editor'

export const useDeserializeSelectionToNodes = (
  nodeId: string,
  selection: { text: string; metadata?: string }
): NodeEditorContent => {
  const editor = usePlateEditorRef(nodeId)
  const nodes = editor
    ? deserializeHtml(editor, {
        element: selection?.text || ''
      })
    : undefined

  return nodes
}
