import { StoreIdentifier } from "../Types/Store"
import { createStore } from "../Utils/storeCreator"

const treeStoreConfig = (set, get) => ({
  expanded: [],
  expandNode: (path: string) => {
    set({
      expanded: [...get().expanded, path]
    })
  },
  setHighlightedAt: (index, id) => set({ highlightedAt: { index, id } }),
  expandNodes: (paths: string[]) => {
    set({
      expanded: [...get().expanded, ...paths]
    })
  },
  collapseNode: (path: string) => {
    set({
      expanded: get().expanded.filter((p) => p !== path)
    })
  }
})

export const useTreeStore = createStore(treeStoreConfig, StoreIdentifier.TREE , false)