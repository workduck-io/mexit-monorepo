import { ELEMENT_TASK_VIEW_LINK } from '@mexit/core'
import { DeserializeHtml } from '@udecode/plate'

// * TBD: Make this generic for all custom plugin components.
export const getTaskViewLinkDeserializer = (): DeserializeHtml => {
  return {
    isElement: true,
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_TASK_VIEW_LINK) return

      return {
        type: ELEMENT_TASK_VIEW_LINK,
        value: el.getAttribute('data-slate-value')
      }
    }
  }
}
