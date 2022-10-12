import create from 'zustand'
import { persist } from 'zustand/middleware'

import {
  Contents,
  ILink,
  NodeContent,
  NodeEditorContent,
  NodeMetadata,
  NodeProperties,
  SingleNamespace
} from '@mexit/core'

export interface PublicNodeStoreType {
  // This is the hierarchy of a public namespace
  // This is overwritten on opening another namespace
  iLinks: ILink[]
  setILinks: (nodes: ILink[]) => void

  namespace: SingleNamespace
  setNamespace: (namespace: SingleNamespace) => void

  // Current opened node
  currentNode: NodeProperties
  setCurrentNode: (node: NodeProperties) => void

  // Contents and metadata of nodes of public namespace
  contents: Contents
  getContent: (nodeID: string) => NodeContent
  setContent: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  getMetadata: (nodeid: string) => NodeMetadata
  reset: () => void
}

export const usePublicNodeStore = create<PublicNodeStoreType>(
  persist(
    (set, get) => ({
      iLinks: [],
      contents: {},
      currentNode: null,
      setCurrentNode: (node: NodeProperties) => {
        set({ currentNode: node })
      },
      namespace: undefined,
      setNamespace: (namespace: SingleNamespace) => {
        set({ namespace })
      },
      setILinks: (nodes: ILink[]) => {
        set({ iLinks: nodes })
      },
      getContent: (nodeID: string) => {
        return get().contents[nodeID]
      },
      setContent: (nodeid, content, metadata) => {
        const oldContent = get().contents

        const oldMetadata = oldContent[nodeid] && oldContent[nodeid].metadata ? oldContent[nodeid].metadata : undefined
        delete oldContent[nodeid]
        const nmetadata = { ...oldMetadata, ...metadata }
        set({
          contents: { [nodeid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
        })
      },
      getMetadata: (nodeid) => {
        const contents = get().contents
        return contents[nodeid] && contents[nodeid].metadata ? contents[nodeid].metadata : ({} as NodeMetadata)
      },
      reset: () => {
        set({ contents: {}, currentNode: null, iLinks: [] })
      }
    }),
    { name: 'mexit-public-node-store', version: 2 }
  )
)
