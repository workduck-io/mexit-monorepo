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

  input: string
  setInput: (val: string) => void

  // * Selection from page
  selection?: any
  setSelection: (selection?: any) => void

  // * Search Results
  results?: Array<ListItemType>
  setResults: (items: Array<ListItemType>) => void

  child?: any
  setChild: (child?: any) => void

  // * Current Active action item from `items`
  activeItem?: ListItemType | MexitAction
  setActiveItem: (item?: ListItemType | MexitAction) => void

  // * Reset app State
  reset: () => void
}

export const useSputlitStore = create<SputlitStore>(
  devtools((set) => ({
    search: { value: '', type: CategoryType.action },
    setSearch: (query) => set({ search: query }),

    input: '',
    setInput: (value) => set({ input: value }),

    results: [],
    setResults: (results) => set({ results }),

    setSelection: (selection) => set({ selection }),
    setChild: (child) => set({ child }),

    setActiveItem: (item) => set({ activeItem: item }),
    reset: () =>
      set({
        search: { value: '', type: CategoryType.action },
        activeItem: undefined,
        results: [],
        selection: undefined,
        input: ''
      })
  }))
)
