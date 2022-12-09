import { createPluginFactory, getSlateClass } from '@udecode/plate'

import { ELEMENT_ILINK } from '@mexit/core'

// TODO: because of editor store not being here, not adding the' backspace delete only the closing brackets' things
export const createQuickLinkPlugin = createPluginFactory({
  key: ELEMENT_ILINK,
  isElement: true,
  deserializeHtml: {
    getNode: (el) => ({
      value: el.getAttribute('data-slate-value')
    }),
    rules: [{ validClassName: getSlateClass(ELEMENT_ILINK) }]
  },
  isInline: true,
  isVoid: true
})
