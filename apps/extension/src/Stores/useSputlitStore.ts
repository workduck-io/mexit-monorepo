import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { CategoryType, ListItemType, MexitAction } from '@mexit/core'

export type SearchType = {
  value: string
  type: CategoryType
}

interface SputlitStore {
  // * Search Query
  search: SearchType
  setSearch: (query: SearchType) => void

  // * Search Results
  items?: Array<ListItemType>
  setItems: (items: Array<ListItemType>) => void

  // * Current Active action item from `items`
  activeItem?: ListItemType | MexitAction
  setActiveItem: (item?: ListItemType | MexitAction) => void

  // * Reset app State
  reset: () => void
}

export const useSputlitStore = create<SputlitStore>(
  devtools((set) => ({
    search: { value: '', type: CategoryType.search },

    setSearch: (query) => set({ search: query }),
    setItems: (items) => set({ items }),

    setActiveItem: (item) => set({ activeItem: item }),
    reset: () => set({ search: { value: '', type: CategoryType.search }, activeItem: undefined, items: [] })
  }))
)
