import { getNodesRange } from '@udecode/plate'
import { createPluginFactory, Decorate } from '@udecode/plate-core'

import { mog } from '@mexit/core'

import { useBlockHighlightStore } from '../../Stores/useFocusBlock'

interface HighlightPlugin {} // eslint-disable-line @typescript-eslint/no-empty-interface

// eslint-disable-next-line @typescript-eslint/ban-types
export const decorateHighlightElement: Decorate<{}, HighlightPlugin> =
  (editor, { key, type }) =>
  ([node, path]: any) => {
    const ranges = []

    const isBlockHighlighted = useBlockHighlightStore.getState().isBlockHighlighted
    const highlightedBlocks = useBlockHighlightStore.getState().hightlighted.editor

    try {
      const { text } = node

      const isHighlighled = isBlockHighlighted(node?.id ?? '')

      if (isHighlighled && path) {
        const range1 = getNodesRange(editor, [[node, path]])
        // mog('decorate', { text, range1, node, path, ranges, highlightedBlocks })
        ranges.push({ ...range1, [type]: true })
      }
    } catch (e) {
      mog('DecorateFindReplaceError', { error: e })
    }

    return ranges
  }

export const MARK_HIGHLIGHT = 'highlight'

export const createHighlightTextPlugin = createPluginFactory({
  key: MARK_HIGHLIGHT,
  decorate: decorateHighlightElement
})
