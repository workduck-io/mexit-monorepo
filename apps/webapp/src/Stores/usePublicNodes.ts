import create from 'zustand'
import { persist } from 'zustand/middleware'

import { IDBStorage, NodeEditorContent, NodeMetadata } from '@mexit/core'

export interface PublicNode {
  id: string
  title: string
  content: NodeEditorContent
  metadata: NodeMetadata
}

export interface PublicNodeStoreType {
  nodes: Record<string, PublicNode>
  addPublicNode: (node: PublicNode) => void
  getPublicNode: (nodeID: string) => PublicNode
}

export const usePublicNodeStore = create<PublicNodeStoreType>(
  persist(
    (set, get) => ({
      nodes: {},
      addPublicNode: (node: PublicNode) => {
        set({ nodes: { ...get().nodes, [node.id]: node } })
      },
      getPublicNode: (nodeID: string) => {
        return get().nodes[nodeID]
      }
    }),
    { name: 'mexit-public-node-store', getStorage: () => IDBStorage }
  )
)
