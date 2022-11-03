import create from 'zustand'

interface TreeState {
  // Path of the expanded nodes
  expanded: string[]

  highlightedAt?: { index: number; id: string }
  setHighlightedAt: (index: number, id: string) => void

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
}))
