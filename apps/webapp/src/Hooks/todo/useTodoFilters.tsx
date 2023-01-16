import create from 'zustand'

import { Filter, Filters, GlobalFilterJoin } from '@mexit/core'

import { FilterStore } from '../useFilters'

export const useTodoFilterStore = create<FilterStore>((set) => ({
  currentFilters: [],
  setCurrentFilters: (filters: Filter[]) => set({ currentFilters: filters }),
  globalJoin: 'all',
  setGlobalJoin: (join: GlobalFilterJoin) => set({ globalJoin: join }),
  indexes: [],
  setIndexes: () => undefined,
  filters: [],
  setFilters: (filters: Filters) => set({ filters })
}))
