import { PlatePlugin } from '@udecode/plate-core'

import { SuperBlocks } from '@mexit/core'

import HighlightSuperBlock from '../Components/SuperBlock/HighlightSuperBlock'
import { withSuperBlockElement } from '../Components/SuperBlock/withSuperBlockElement'

/**
 * Enables support for Super Block - HIGHLIGHT.
 */
export const createHighlightSuperBlockPlugin = (): PlatePlugin => ({
  key: SuperBlocks.HIGHLIGHT,
  isElement: true,
  deserializeHtml: {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== SuperBlocks.HIGHLIGHT) return

      return {
        type: SuperBlocks.HIGHLIGHT,
        status: el.getAttribute('data-slate-value')
      }
    }
  },
  component: withSuperBlockElement(HighlightSuperBlock),
  isInline: false,
  isVoid: false
})
