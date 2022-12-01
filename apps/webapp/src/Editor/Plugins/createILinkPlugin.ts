import { ELEMENT_ILINK, mog } from '@mexit/core'

import { getPathFromNodeIdHookless } from '../../Hooks/useLinks'
import { useEditorStore } from '../../Stores/useEditorStore'
import { ComboboxKey } from '../Types/Combobox'
import { getPreviousNode, insertText } from '@udecode/plate'
import { PlatePlugin, WithOverride } from '@udecode/plate-core'
import { Range } from 'slate'

/**
 * Enables support for Internal links.
 */
export const createILinkPlugin = (): PlatePlugin => ({
  key: ELEMENT_ILINK,
  isElement: true,
  deserializeHtml: {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_ILINK) return

      return {
        value: el.getAttribute('data-slate-value')
      }
    }
  },
  isInline: true,
  isVoid: true,
  withOverrides: withILink
})

/**
 *
 * On DeleteBackward:
 * Check if the node above is a ILink and if so, delete it and insert the Ilink value to be edited by the user
 *
 */
export const withILink: WithOverride = (editor, { type, options }) => {
  // mog('Setup Plugin with ILink', { type, options })
  const { deleteBackward } = editor

  editor.deleteBackward = (options) => {
    const prev = getPreviousNode(editor)
    if (prev && prev[0]) {
      const node = prev[0] as any
      mog('NODE TYPE', { node })
      if (node.type && node.type === ELEMENT_ILINK && node.value) {
        deleteBackward('block')
        const val = getPathFromNodeIdHookless(node.value)
        mog('value in editor is', { node, val })

        // * On delete, cursor location
        const start = editor.selection
        const cursor = Range.start(start)

        // * Replace The ILink with the values
        insertText(editor, `[[${val} `)

        // * Set the cursor to the end of the inserted text
        useEditorStore
          .getState()
          .setTrigger({ cbKey: ComboboxKey.INTERNAL, blockTrigger: ':', trigger: '[[', at: cursor })
      }
    }
    deleteBackward(options)
  }

  return editor
}
