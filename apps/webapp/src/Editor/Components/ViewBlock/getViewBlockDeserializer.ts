import { DeserializeHtml } from '@udecode/plate'

import { ELEMENT_TASK_VIEW_BLOCK } from '@mexit/core'

// * TBD: Make this generic for all custom plugin components.
export const getViewBlockDeserializer = (): DeserializeHtml => {
  return {
    isElement: true,
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_TASK_VIEW_BLOCK) return

      return {
        type: ELEMENT_TASK_VIEW_BLOCK,
        value: el.getAttribute('data-slate-value')
      }
    }
  }
}
