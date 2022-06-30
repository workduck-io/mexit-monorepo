import React from 'react'
import { Editor, Transforms } from 'slate'
import { findNode, getPlateEditorRef } from '@udecode/plate'
import { ReactEditor } from 'slate-react'
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
  hightlighted: Highlighted
  addHighlightedBlockId: (id: string, key: keyof Highlighted) => void
  setHighlightedBlockIds: (ids: string[], key: keyof Highlighted) => void
  clearHighlightedBlockIds: (key: keyof Highlighted) => void
  clearAllHighlightedBlockIds: () => void
  isBlockHighlighted: (id: string) => boolean
}

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
        Transforms.select(editor, Editor.start(editor, headingNodePath))
        ReactEditor.focus(editor)
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
            console.log('n', n)
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
        Transforms.select(editor, Editor.start(editor, headingNodePath))
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
