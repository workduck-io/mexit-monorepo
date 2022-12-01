import { ELEMENT_INLINE_BLOCK } from '@mexit/core'

import { DeserializeHtml } from '@udecode/plate'

// * TBD: Make this generic for all custom plugin components.
export const getInlineBlockDeserializer = (): DeserializeHtml => {
  return {
    isElement: true,
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_INLINE_BLOCK) return

      return {
        type: ELEMENT_INLINE_BLOCK,
        value: el.getAttribute('data-slate-value')
      }
    }
  }
}
