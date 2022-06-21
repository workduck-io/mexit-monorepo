import { Editor } from 'slate'
import { PlatePlugin, WithOverride, deleteFragment } from '@udecode/plate-core'

import { ELEMENT_MENTION, mog } from '@mexit/core'
import { getUserFromUseridHookless } from '../../Stores/useMentionsStore'
// import { ELEMENT_MENTION } from './defaults'

// import { getMentionDeserialize } from './getMentionDeserialize'
// import { mog } from '../../../utils/lib/helper'
// import { getUserFromUseridHookless } from '@store/useMentionStore'

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
export const withMention: WithOverride<any, PlatePlugin> = (editor, { type, options }) => {
  // mog('Setup Plugin with Tag', { type, options })
  const { deleteBackward } = editor

  editor.deleteBackward = (options) => {
    const prev = Editor.previous(editor)
    if (prev && prev[0]) {
      const node = prev[0] as any
      if (node.type && node.type === ELEMENT_MENTION && node.value) {
        const user = getUserFromUseridHookless(node.value)
        const val = user && user.alias ? user.alias : node.value
        deleteFragment(editor, { at: prev[1], unit: 'block' })
        Editor.insertText(editor, `@${val}`)
      }
    }
    deleteBackward(options)
  }

  return editor
}
