import create from 'zustand'

import { defaultContent, NodeEditorContent } from '@mexit/core'

type EditorStoreType = {
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  previewMode: boolean
  setPreviewMode: (val: boolean) => void
}

export const useEditorStore = create<EditorStoreType>((set, get) => ({
  nodeContent: defaultContent.content,
  setNodeContent: (content) => {
    set({ nodeContent: content })
  },
  previewMode: false,
  setPreviewMode: (val) => {
    set({ previewMode: val })
  }
}))
