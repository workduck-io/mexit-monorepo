import create from 'zustand'
import { NodeContent, Metadata, NodeEditorContent } from '../types/data'

export interface Contents {
  [key: string]: NodeContent
}

interface ContentStoreState {
  contents: Contents
  saved: boolean
  setSaved: (saved: boolean) => void
  removeContent: (nodeid: string) => void
  getContent: (nodeid: string) => NodeContent
  setContent: (nodeid: string, content: NodeEditorContent, metadata?: Metadata) => void
  setMetadata: (nodeid: string, metadata: Metadata) => void
  initContents: (contents: Contents) => void
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  contents: {},
  saved: false,
  setSaved: (saved) => set(() => ({ saved })),
  setContent: (nodeid, content, metadata) => {
    const oldContent = get().contents

    const oldMetadata = oldContent[nodeid] && oldContent[nodeid].metadata ? oldContent[nodeid].metadata : undefined
    delete oldContent[nodeid]
    const nmetadata = { ...oldMetadata, ...metadata }
    set({
      contents: { [nodeid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
    })
  },
  setMetadata: (nodeid: string, metadata: Metadata) => {
    const oldContent = get().contents
    const oldMetadata = oldContent[nodeid] && oldContent[nodeid].metadata ? oldContent[nodeid].metadata : undefined
    const content = oldContent[nodeid] && oldContent[nodeid].content ? oldContent[nodeid].content : undefined
    delete oldContent[nodeid]
    const nmetadata = { ...oldMetadata, ...metadata }
    set({
      contents: { [nodeid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
    })
  },
  getContent: (nodeid) => {
    return get().contents[nodeid]
  },
  removeContent: (nodeid) => {
    const oldContent = get().contents
    delete oldContent[nodeid]
  },
  initContents: (contents) => {
    set({
      contents
    })
  }
}))
