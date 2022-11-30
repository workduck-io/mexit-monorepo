import { ELEMENT_ILINK } from '@mexit/core'
import { createPluginFactory, getSlateClass } from '@udecode/plate'

import { QuickLinkElement } from './components/QuickLinkElement'

// TODO: because of editor store not being here, not adding the' backspace delete only the closing brackets' things
export const createQuickLinkPlugin = createPluginFactory({
  key: ELEMENT_ILINK,
  isElement: true,
  component: QuickLinkElement,
  deserializeHtml: {
    getNode: (el) => ({
      value: el.getAttribute('data-slate-value')
    }),
    rules: [{ validClassName: getSlateClass(ELEMENT_ILINK) }]
  },
  isInline: true,
  isVoid: true
})
