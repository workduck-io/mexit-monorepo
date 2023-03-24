import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

type TreeNodeIdentifier = string
type HighlightedTreeNode = { index: number; id: string }

const treeStoreConfig = (set, get) => ({
  expanded: [] as TreeNodeIdentifier[],
  highlightedAt: undefined as HighlightedTreeNode | undefined,
  expandNode: (path: TreeNodeIdentifier) => {
    set({
      expanded: [...get().expanded, path]
    })
  },
  setHighlightedAt: (index: number, id: string) => set({ highlightedAt: { index, id } }),
  expandNodes: (paths: TreeNodeIdentifier[]) => {
    set({
      expanded: [...get().expanded, ...paths]
    })
  },
  collapseNode: (path: TreeNodeIdentifier) => {
    set({
      expanded: get().expanded.filter((p: TreeNodeIdentifier) => p !== path)
    })
  }
})

export const useTreeStore = createStore(treeStoreConfig, StoreIdentifier.TREE, false)
