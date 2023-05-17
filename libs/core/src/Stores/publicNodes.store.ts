import { Contents, ILink, NodeEditorContent, NodeMetadata, NodeProperties } from '../Types/Editor'
import { SingleNamespace, StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const publicNodeStoreConfig = (set, get) => ({
  iLinks: [] as ILink[],
  contents: {} as Contents,
  currentNode: null as NodeProperties | null,
  setCurrentNode: (node: NodeProperties) => {
    set({ currentNode: node })
  },
  namespace: undefined as SingleNamespace | undefined,
  setNamespace: (namespace: SingleNamespace) => {
    set({ namespace })
  },
  setILinks: (nodes: ILink[]) => {
    set({ iLinks: nodes })
  },
  getContent: (nodeID: string) => {
    return get().contents[nodeID]
  },
  setContent: (nodeId: string, content: NodeEditorContent, metadata: NodeMetadata) => {
    const oldContent = get().contents

    const oldMetadata = oldContent[nodeId] && oldContent[nodeId].metadata ? oldContent[nodeId].metadata : undefined
    delete oldContent[nodeId]
    const nmetadata = { ...oldMetadata, ...metadata }
    set({
      contents: { [nodeId]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
    })
  },
  getMetadata: (nodeId) => {
    const contents = get().contents
    return contents[nodeId] && contents[nodeId].metadata ? contents[nodeId].metadata : ({} as NodeMetadata)
  },
  reset: () => {
    set({ contents: {}, currentNode: null, iLinks: [] })
  }
})

export const usePublicNodeStore = createStore(publicNodeStoreConfig, StoreIdentifier.PUBLICNODES, false)
