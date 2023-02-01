import create from 'zustand'

import { Filter, Filters, GlobalFilterJoin } from '@mexit/core'
import { ViewType } from '@mexit/shared'

import { FilterStore } from '../useFilters'

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
  viewType: ViewType.Kanban,
  setViewType: (viewType: ViewType) => set({ viewType }),
  setFilters: (filters: Filters) => set({ filters }),
  setSortType: (sortType) => set((state) => ({ ...state, sortType })),
  setSortOrder: (sortOrder) => set((state) => ({ ...state, sortOrder }))
}))

export const useTodoFilters = () => {
  const filters = useTodoFilterStore((state) => state.filters)
  const currentFilters = useTodoFilterStore((state) => state.currentFilters)
  const setCurrentFilters = useTodoFilterStore((state) => state.setCurrentFilters)
  const setFilters = useTodoFilterStore((s) => s.setFilters)
  const globalJoin = useTodoFilterStore((state) => state.globalJoin)
  const setGlobalJoin = useTodoFilterStore((state) => state.setGlobalJoin)
  const sortOrder = useTodoFilterStore((state) => state.sortOrder)
  const sortType = useTodoFilterStore((state) => state.sortType)
  const onSortTypeChange = useTodoFilterStore((state) => state.setSortType)
  const onSortOrderChange = useTodoFilterStore((state) => state.setSortOrder)
  const viewType = useTodoFilterStore((state) => state.viewType)
  const onViewTypeChange = useTodoFilterStore((state) => state.setViewType)

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
