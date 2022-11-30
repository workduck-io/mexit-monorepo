import { defaultContent, NodeEditorContent } from '@mexit/core'
import create from 'zustand'

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
  previewMode: true,
  setPreviewMode: (val) => {
    set({ previewMode: val })
  }
}))
