import { getSlateClass, createPluginFactory } from '@udecode/plate-core'
import TagElement from '../Components/Tags/TagElement'

export const COMET_TAG = 'tag'

/**
 * Enables support for hypertags.
 */
export const createTagPlugin = createPluginFactory({
  key: COMET_TAG,
  isElement: true,
  component: TagElement,
  deserializeHtml: {
    getNode: (el) => ({
      type: COMET_TAG,
      value: el.getAttribute('data-slate-value')
    }),
    rules: [{ validClassName: getSlateClass(COMET_TAG) }]
  },
  isInline: true,
  isVoid: true
})
