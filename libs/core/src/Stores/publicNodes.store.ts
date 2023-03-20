import { Contents, ILink, NodeEditorContent, NodeMetadata, NodeProperties } from '../Types/Editor';
import { SingleNamespace, StoreIdentifier } from '../Types/Store';
import { createStore } from '../Utils/storeCreator'


export const publicNodeStoreConfig = (set, get) => ({
  iLinks: [] as ILink[],
  contents: {} as Contents,
  currentNode: null as NodeProperties,
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
  setContent: (nodeid: string, content: NodeEditorContent, metadata: NodeMetadata) => {
    const oldContent = get().contents

    const oldMetadata = oldContent[nodeid] && oldContent[nodeid].metadata ? oldContent[nodeid].metadata : undefined
    delete oldContent[nodeid]
    const nmetadata = { ...oldMetadata, ...metadata }
    set({
      contents: { [nodeid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
    })
  },
  getMetadata: (nodeid: string) => {
    const contents = get().contents
    return contents[nodeid] && contents[nodeid].metadata ? contents[nodeid].metadata : ({} as NodeMetadata)
  },
  reset: () => {
    set({ contents: {}, currentNode: null, iLinks: [] })
  }
})

export const usePublicNodeStore = createStore(publicNodeStoreConfig, StoreIdentifier.PUBLICNODES , false)