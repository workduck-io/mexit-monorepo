import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { CategoryType, ListItemType } from '@mexit/core'

export type SearchType = {
  value: string
  type: CategoryType
}

interface SputlitStore {
  search: SearchType
  setSearch: (query: SearchType) => void
  items?: Array<ListItemType>
  setItems: (items: Array<ListItemType>) => void
}

export const useSputlitStore = create<SputlitStore>(
  devtools((set) => ({
    search: { value: '', type: CategoryType.search },
    setSearch: (query) => set({ search: query }),
    setItems: (items) => set({ items })
  }))
)
