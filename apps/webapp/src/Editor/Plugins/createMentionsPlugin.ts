import { getPreviousNode, insertText } from '@udecode/plate'
import { PlatePlugin, WithOverride } from '@udecode/plate-core'

import { ELEMENT_MENTION , getUserFromUseridHookless } from '@mexit/core'

/**
 * Enables support for hypertags.
 */
export const createMentionPlugin = (): PlatePlugin => ({
  key: ELEMENT_MENTION,
  isElement: true,
  deserializeHtml: {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_MENTION) return

      return {
        type: ELEMENT_MENTION,
        value: el.getAttribute('data-slate-value'),
        email: el.getAttribute('data-slate-email')
      }
    }
  },
  isInline: true,
  isVoid: true,
  withOverrides: withMention
})

/**
 *
 * On DeleteBackward:
 * Check if the node above is a Tag and if so, delete it and insert the tag value to be edited by the user
 *
 */
export const withMention: WithOverride = (editor, { type, options }) => {
  // mog('Setup Plugin with Tag', { type, options })
  const { deleteBackward } = editor

  editor.deleteBackward = (options) => {
    const prev = getPreviousNode(editor)
    if (prev && prev[0]) {
      const node = prev[0] as any
      if (node.type && node.type === ELEMENT_MENTION && node.value) {
        const user = getUserFromUseridHookless(node.value)
        const val = user && user.alias ? user.alias : node.value
        deleteBackward('word')
        insertText(editor, `@${val}`)
      }
    }
    deleteBackward(options)
  }

  return editor
}
