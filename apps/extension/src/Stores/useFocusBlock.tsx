
import { findNode, focusEditor, getPlateEditorRef, getStartPoint, select } from '@udecode/plate'

import { mog } from '@mexit/core'


export const useFocusBlock = () => {
  const selectBlock = (blockid: string, editorId?: string) => {
    try {
      const editor = editorId ? getPlateEditorRef(editorId) : getPlateEditorRef()
      mog('editor', { editor })
      if (editor) {
        const headingNode = findNode(editor, {
          at: [],
          match: (n) => {
            // console.log('n', n)
            return n.id === blockid
          },
          mode: 'all'
        })
        // console.log('select heading', { heading, headingNode, e })
        if (!headingNode) return
        const headingNodePath = headingNode[1]

        mog('select block', { blockid, headingNode, headingNodePath })
        if (!headingNodePath) return

        // setHighlightedBlockIds([blockid], key)
        select(editor, getStartPoint(editor, headingNodePath))
        focusEditor(editor)
      }
    } catch (e) {
      console.log('select block error', e)
    }
  }
  const focusBlock = (blockid: string, editorId?: string) => {
    try {
      const editor = editorId ? getPlateEditorRef(editorId) : getPlateEditorRef()
      mog('editor', { editor })
      if (editor) {
        const headingNode = findNode(editor, {
          at: [],
          match: (n) => {
            // console.log('n', n)
            return n.id === blockid
          },
          mode: 'all'
        })
        mog('mog', { headingNode })
        if (!headingNode) return
        const headingNodePath = headingNode[1]

        mog('select block', { blockid, headingNode, headingNodePath })
        if (!headingNodePath) return

        // setHighlightedBlockIds([blockid], key)
        select(editor, getStartPoint(editor, headingNodePath))
        setTimeout(() => {
          const highlightEl = document.getElementsByClassName('slate-highlight')[0]
          if (highlightEl) {
            highlightEl.scrollIntoView({
              block: 'center',
              inline: 'center'
            })
          }
        }, 50)
      }
    } catch (e) {
      console.log('select block error', e)
    }
  }

  return { selectBlock, focusBlock }
}
