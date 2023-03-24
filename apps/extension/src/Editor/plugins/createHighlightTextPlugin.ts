import { getNodesRange } from '@udecode/plate'
import { createPluginFactory, Decorate } from '@udecode/plate-core'

import { useBlockHighlightStore } from '@mexit/core'


// eslint-disable-next-line @typescript-eslint/ban-types
export const decorateHighlightElement: Decorate =
  (editor, { key, type }) =>
  ([node, path]: any) => {
    const ranges = []

    const isBlockHighlighted = useBlockHighlightStore.getState().isBlockHighlighted

    try {
      const text = node?.text

      const isHighlighled = isBlockHighlighted(node?.id ?? '')

      if (isHighlighled && path) {
        const range1 = getNodesRange(editor, [[node, path]])
        // mog('decorate', { text, range1, node, path, ranges, highlightedBlocks })
        ranges.push({ ...range1, [type]: true })
      }
    } catch (e) {
      console.log('decorateFindReplace Error', e)
    }

    return ranges
  }

export const MARK_HIGHLIGHT = 'highlight'

export const createHighlightTextPlugin = createPluginFactory({
  key: MARK_HIGHLIGHT,
  decorate: decorateHighlightElement
})
