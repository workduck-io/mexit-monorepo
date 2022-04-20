import { ELEMENT_LINK, wrapLink } from '@udecode/plate'
import { getPluginType, insertNodes, isCollapsed, PlateEditor, TElement, unwrapNodes } from '@udecode/plate-core'
import { BaseRange, Editor, Transforms } from 'slate'
// import { ELEMENT_LINK } from '../createLinkPlugin'
// import { wrapLink } from './wrapLink'

/**
 * Unwrap link at a location (default: selection).
 * Then, the focus of the location is set to selection focus.
 * Then, wrap the link at the location.
 */
export const upsertLinkAtSelection = <T = any>(
  editor: PlateEditor<T>,
  {
    url,
    wrap,
    at
  }: {
    url: string
    /**
     * If true, wrap the link at the location (default: selection) even if the selection is collapsed.
     */
    wrap?: boolean
    at?: BaseRange
  }
) => {
  if (!at) return

  const type = getPluginType(editor, ELEMENT_LINK)

  if (!wrap && isCollapsed(at)) {
    return insertNodes<TElement>(editor, {
      type,
      url,
      children: [{ text: url }]
    })
  }

  // if our cursor is inside an existing link, but don't have the text selected, select it now
  if (wrap && isCollapsed(at)) {
    const linkLeaf = Editor.leaf(editor, at)
    const [, inlinePath] = linkLeaf
    Transforms.select(editor, inlinePath)
  }

  unwrapNodes(editor, { at: at, match: { type } })

  wrapLink(editor, { at: at, url })

  Transforms.collapse(editor, { edge: 'end' })
}
