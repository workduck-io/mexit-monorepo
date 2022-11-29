
import { mog } from '@mexit/core'
import { findNode, focusEditor, getPlateEditorRef, getStartPoint, select } from '@udecode/plate'
import create from 'zustand'

interface Highlighted {
  preview: string[]
  editor: string[]
}
interface BlockHighlightStore {
  /*
   * The current ids for specific editors to highlight
   */
  hightlighted: Highlighted
  addHighlightedBlockId: (id: string, key: keyof Highlighted) => void
  setHighlightedBlockIds: (ids: string[], key: keyof Highlighted) => void
  clearHighlightedBlockIds: (key: keyof Highlighted) => void
  clearAllHighlightedBlockIds: () => void
  isBlockHighlighted: (id: string) => boolean
}

/**
 * Used to store the state related to the highlighted blocks in the editor
 * NOTE: This is not affiliated with highlights captured from web
 */
export const useBlockHighlightStore = create<BlockHighlightStore>((set, get) => ({
  hightlighted: {
    preview: [],
    editor: []
  },
  addHighlightedBlockId: (id, key) => {
    const { hightlighted } = get()
    const newHighlighted = { ...hightlighted }
    newHighlighted[key].push(id)
    // mog('addHighlighted', { newHighlighted, id, key })
    set({ hightlighted: newHighlighted })
  },
  setHighlightedBlockIds: (ids, key) => {
    const { hightlighted } = get()
    const newHighlighted = { ...hightlighted }
    newHighlighted[key] = ids
    // mog('setHighlighted', { newHighlighted, ids, key })
    set({ hightlighted: newHighlighted })
  },
  clearHighlightedBlockIds: () => {
    const oldHighlighted = get().hightlighted
    const newHighlighted = {
      preview: [],
      editor: []
    }
    mog('clearHighlighted', { oldHighlighted })
    set({ hightlighted: newHighlighted })
  },
  clearAllHighlightedBlockIds: () => {
    const oldHighlighted = get().hightlighted
    const newHighlighted = {
      preview: [],
      editor: []
    }
    mog('clearAllHighlighted', { oldHighlighted })
    set({ hightlighted: newHighlighted })
  },
  isBlockHighlighted: (id) => {
    const { hightlighted } = get()
    // mog('isBlockHighlighted', { hightlighted, id })
    return hightlighted.editor.includes(id) || hightlighted.preview.includes(id)
  }
}))

export const useFocusBlock = () => {
  const selectBlock = (blockid: string, editorId?: string) => {
    try {
      const editor = editorId ? getPlateEditorRef(editorId) : getPlateEditorRef()
      mog('selection editor', { editor, editorId })
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
      mog('editor', { blockid, editorId, editor })
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

        mog('focus block', { blockid, headingNode, headingNodePath })
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
        }, 100)
      }
    } catch (e) {
      mog('select block error', { e })
    }
  }

  return { selectBlock, focusBlock }
}
