import React from 'react'

import { findNode, focusEditor, getPlateEditorRef, getStartPoint, select } from '@udecode/plate'
import create from 'zustand'

import { mog } from '@mexit/core'

interface Highlighted {
  preview: string[]
  editor: string[]
}
interface BlockHighlightStore {
  /*
   * The current ids for specific editors to highlight
   */
  highlighted: Highlighted
  addHighlightedBlockId: (id: string, key: keyof Highlighted) => void
  setHighlightedBlockIds: (ids: string[], key: keyof Highlighted) => void
  clearHighlightedBlockIds: (key: keyof Highlighted) => void
  clearAllHighlightedBlockIds: () => void
  isBlockHighlighted: (id: string) => boolean
}

export const useBlockHighlightStore = create<BlockHighlightStore>((set, get) => ({
  highlighted: {
    preview: [],
    editor: []
  },
  addHighlightedBlockId: (id, key) => {
    const { highlighted } = get()
    const newHighlighted = { ...highlighted }
    newHighlighted[key].push(id)
    // mog('addHighlighted', { newHighlighted, id, key })
    set({ highlighted: newHighlighted })
  },
  setHighlightedBlockIds: (ids, key) => {
    const { highlighted } = get()
    const newHighlighted = { ...highlighted }
    newHighlighted[key] = ids
    // mog('setHighlighted', { newHighlighted, ids, key })
    set({ highlighted: newHighlighted })
  },
  clearHighlightedBlockIds: () => {
    const oldHighlighted = get().highlighted
    const newHighlighted = {
      preview: [],
      editor: []
    }
    mog('clearHighlighted', { oldHighlighted })
    set({ highlighted: newHighlighted })
  },
  clearAllHighlightedBlockIds: () => {
    const oldHighlighted = get().highlighted
    const newHighlighted = {
      preview: [],
      editor: []
    }
    mog('clearAllHighlighted', { oldHighlighted })
    set({ highlighted: newHighlighted })
  },
  isBlockHighlighted: (id) => {
    const { highlighted } = get()
    // mog('isBlockHighlighted', { hightlighted, id })
    return highlighted.editor.includes(id) || highlighted.preview.includes(id)
  }
}))

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
