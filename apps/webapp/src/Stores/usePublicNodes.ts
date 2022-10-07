import create from 'zustand'
import { persist } from 'zustand/middleware'

import { Contents, IDBStorage, ILink, NodeEditorContent, NodeMetadata, SingleNamespace } from '@mexit/core'

export interface PublicNodeStoreType {
  iLinks: ILink[]
  setILinks: (nodes: ILink[]) => void
  contents: Contents
  setContent: (nodeID: string, content: NodeEditorContent) => void
  namespace: SingleNamespace
  setNamespace: (namespace: SingleNamespace) => void
}

export const usePublicNodeStore = create<PublicNodeStoreType>(
  persist(
    (set, get) => ({
      iLinks: [],
      contents: {},
      namespace: undefined,
      setNamespace: (namespace: SingleNamespace) => {
        set({ namespace })
      },
      setILinks: (nodes: ILink[]) => {
        set({ iLinks: nodes })
      },
      setContent: (nodeID: string, content: NodeEditorContent) => {
        const oldContent = get().contents

        delete oldContent[nodeID]
        set({
          contents: { [nodeID]: { type: 'editor', content }, ...oldContent }
        })
      }
    }),
    { name: 'mexit-public-node-store', version: 2 }
  )
)
