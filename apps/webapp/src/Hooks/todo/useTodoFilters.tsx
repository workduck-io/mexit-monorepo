import create from 'zustand'

import { Filter, Filters, GlobalFilterJoin, ViewType } from '@mexit/core'

import { FilterStore, useFilterStore } from '../useFilters'

export const useTodoFilterStore = create<FilterStore>((set) => ({
  currentFilters: [],
  setCurrentFilters: (filters: Filter[]) => set({ currentFilters: filters }),
  globalJoin: 'all',
  sortType: 'status',
  sortOrder: 'ascending',
  setGlobalJoin: (join: GlobalFilterJoin) => set({ globalJoin: join }),
  indexes: [],
  setIndexes: () => undefined,
  filters: [],
  viewType: ViewType.List,
  setViewType: (viewType: ViewType) => set({ viewType }),
  setFilters: (filters: Filters) => set({ filters }),
  setSortType: (sortType) => set((state) => ({ ...state, sortType })),
  setSortOrder: (sortOrder) => set((state) => ({ ...state, sortOrder }))
}))

export const useTodoFilters = () => {
  const filters = useFilterStore((state) => state.filters)
  const currentFilters = useFilterStore((state) => state.currentFilters)
  const setCurrentFilters = useFilterStore((state) => state.setCurrentFilters)
  const setFilters = useFilterStore((s) => s.setFilters)
  const globalJoin = useFilterStore((state) => state.globalJoin)
  const setGlobalJoin = useFilterStore((state) => state.setGlobalJoin)
  const sortOrder = useFilterStore((state) => state.sortOrder)
  const sortType = useFilterStore((state) => state.sortType)
  const onSortTypeChange = useFilterStore((state) => state.setSortType)
  const onSortOrderChange = useFilterStore((state) => state.setSortOrder)
  const viewType = useFilterStore((state) => state.viewType)
  const onViewTypeChange = useFilterStore((state) => state.setViewType)

  const resetFilters = () => {
    setFilters([])
  }

  const addCurrentFilter = (filter: Filter) => {
    setCurrentFilters([...currentFilters, filter])
  }

  const removeCurrentFilter = (filter: Filter) => {
    setCurrentFilters(currentFilters.filter((f) => f.id !== filter.id))
  }

  const changeCurrentFilter = (filter: Filter) => {
    setCurrentFilters(currentFilters.map((f) => (f.id === filter.id ? filter : f)))
  }

  const resetCurrentFilters = () => {
    setCurrentFilters([])
  }

  return {
    filters,
    currentFilters,
    setCurrentFilters,
    setFilters,
    globalJoin,
    setGlobalJoin,
    resetFilters,
    addCurrentFilter,
    removeCurrentFilter,
    changeCurrentFilter,
    resetCurrentFilters,
    sortOrder,
    sortType,
    viewType,
    onViewTypeChange,
    onSortTypeChange,
    onSortOrderChange
  }
}
