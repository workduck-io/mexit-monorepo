import create from 'zustand'
import { persist } from 'zustand/middleware'

import { NodeContent, NodeMetadata, NodeEditorContent } from '../Types/Data'

export interface Contents {
  [key: string]: NodeContent
}

interface ContentStoreState {
  contents: Contents
  saved: boolean
  setSaved: (saved: boolean) => void
  removeContent: (nodeid: string) => void
  getContent: (nodeid: string) => NodeContent
  setContent: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  setMetadata: (nodeid: string, metadata: NodeMetadata) => void
  initContents: (contents: Contents) => void
}

const useContentStore = create<ContentStoreState>(
  persist(
    (set, get) => ({
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
      setMetadata: (nodeid: string, metadata: NodeMetadata) => {
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
    }),
    { name: 'mexit-content-store' }
  )
)

export default useContentStore
