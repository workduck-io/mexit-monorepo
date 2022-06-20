import { Editor, Transforms } from 'slate'

import { ELEMENT_MENTION } from '@mexit/core'

export const replaceUserMention = (editor: any, alias: string, userid: string) => {
  const mentionELs = Editor.nodes(editor, {
    at: [], // Path of Editor
    match: (node: any, path) => {
      console.log('Mentions', { node, path })
      return node.type && ELEMENT_MENTION === node.type
    }
    // mode defaults to "all", so this also searches the Editor's children
  })
  let menEl = mentionELs.next()
  while (menEl) {
    const altText = userid
    Transforms.select(editor, menEl[1])
    Editor.insertFragment(editor, [{ text: altText }])
    menEl = mentionELs.next()
  }
}
