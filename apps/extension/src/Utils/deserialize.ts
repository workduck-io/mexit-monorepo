import { ELEMENT_DEFAULT } from '@udecode/plate'
import { deserializeHtml, htmlBodyToFragment, htmlStringToDOMNode } from '@udecode/plate-core'
import { Descendant, Editor, Text } from 'slate'

import { BlockType, generateTempId, mog, NodeEditorContent, updateIds } from '@mexit/core'

const isInlineNode = (editor: Pick<Editor, 'isInline'>) => (node: Descendant) =>
  Text.isText(node) || editor.isInline(node)

export const getDeserializeSelectionToNodes = (
  selection: { text: string; metadata: string },
  editor: any,
  // If true, adds the highlight: true to blocks
  highlight?: boolean
): NodeEditorContent => {
  let nodes
  const element = htmlStringToDOMNode(selection?.text ?? '<p></p>')

  try {
    nodes = editor ? deserializeHtml(editor, { element, stripWhitespace: true }) : undefined

    if (nodes) {
      let isText = true
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]

        if (!isInlineNode(editor)(node)) {
          isText = false
          break
        }
      }

      if (isText) nodes = [{ id: generateTempId(), type: ELEMENT_DEFAULT, children: nodes }]
    }
    if (nodes) nodes = nodes.map((block) => updateIds(block, true))
    if (nodes) nodes = nodes.map((node) => highlightNodes(node, highlight))
  } catch (err) {
    console.log(err)
  }

  mog('deserializeHTML', { nodes, selection, highlight })

  return nodes
}

export const highlightNodes = (blockToHighlight: BlockType, highlight?: boolean) => {
  // * if show is true add highlight else remove highlight from nested obj
  const block = Object.assign({}, blockToHighlight)

  if (highlight) {
    block['highlight'] = true
  } else delete block['highlight']

  // if (block.children) {
  //   block.children = block.children.map((bl) => {
  //     return highlightNodes(bl, highlight)
  //   })
  // }

  return block
}

export const getMexHTMLDeserializer = (HTMLContent: string, editor: any) => {
  const element = htmlStringToDOMNode(HTMLContent ?? '')
  const nodes = editor ? htmlBodyToFragment(editor, element) : undefined

  return nodes
}
