import { NodeEditorContent } from '../Types/Editor'
import { htmlStringToDOMNode, usePlateEditorRef, deserializeHtml, htmlBodyToFragment } from '@udecode/plate-core'

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

export const getMexHTMLDeserializer = (HTMLContent: string, editor: any) => {
  const element = htmlStringToDOMNode(HTMLContent ?? '')
  const nodes = editor ? htmlBodyToFragment(editor, element) : undefined

  return nodes
}
