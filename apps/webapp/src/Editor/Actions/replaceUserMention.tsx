import { Editor, Transforms } from 'slate'
import { insertNodes } from '@udecode/plate'

import { ELEMENT_MENTION, generateTempId } from '@mexit/core'

export const replaceUserMention = (editor: any, alias: string, userid: string) => {
  const mentionELs = Editor.nodes(editor, {
    at: [], // Path of Editor
    match: (node: any, _path) => {
      // console.log('Mentions', { path, type: node.type, val: node.value })
      // Match with all mention nodes with the alias as the value
      return node.type && node.value && ELEMENT_MENTION === node.type && node.value === alias
    }
    // mode defaults to "all", so this also searches the Editor's children
  })
  let menEl = mentionELs.next()

  while (!menEl.done && menEl.value) {
    Transforms.select(editor, menEl.value[1])
    // Delete the mention element with alias
    Transforms.delete(editor)
    // Insert Mention element with userid instead of it
    insertNodes<any>(editor, [{ type: ELEMENT_MENTION, id: generateTempId(), value: userid, children: [] }], {
      at: editor.selection
    })
    // Move to the next found element
    menEl = mentionELs.next()
  }
}
