import create from 'zustand'

interface TreeState {
  // Path of the expanded nodes
  expanded: string[]

  expandNode: (path: string) => void
  expandNodes: (paths: string[]) => void
  collapseNode: (path: string) => void
}

export const useTreeStore = create<TreeState>((set, get) => ({
  expanded: [],
  expandNode: (path: string) => {
    set({
      expanded: [...get().expanded, path]
    })
  },
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
}))
