import { createPluginFactory, getSlateClass } from '@udecode/plate'
import { QuickLinkElement } from '../Components/QuickLink/QuickLinkElement'
import { ELEMENT_ILINK } from '../elements'

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
