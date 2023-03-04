import create from 'zustand'

import { Filter, Filters, GlobalFilterJoin, mog, ViewType } from '@mexit/core'

import { FilterStore } from '../useFilters'

export const useViewFilterStore = create<FilterStore>((set) => ({
  filters: [],
  currentFilters: [],
  setCurrentFilters: (filters: Filter[]) => set({ currentFilters: filters }),
  globalJoin: 'all',
  sortType: 'status',
  sortOrder: 'ascending',
  setGlobalJoin: (join: GlobalFilterJoin) => set({ globalJoin: join }),
  indexes: [],
  setIndexes: () => undefined,
  viewType: ViewType.List,
  setViewType: (viewType: ViewType) => set({ viewType }),
  setFilters: (filters: Filters) => set({ filters }),
  setSortType: (sortType) => set((state) => ({ ...state, sortType })),
  setSortOrder: (sortOrder) => set((state) => ({ ...state, sortOrder }))
}))

export const useViewFilters = () => {
  const filters = useViewFilterStore((state) => state.filters)
  const currentFilters = useViewFilterStore((state) => state.currentFilters)
  const globalJoin = useViewFilterStore((state) => state.globalJoin)
  const sortOrder = useViewFilterStore((state) => state.sortOrder)
  const sortType = useViewFilterStore((state) => state.sortType)
  const viewType = useViewFilterStore((state) => state.viewType)
  const setCurrentFilters = useViewFilterStore((state) => state.setCurrentFilters)
  const setFilters = useViewFilterStore((s) => s.setFilters)
  const setGlobalJoin = useViewFilterStore((state) => state.setGlobalJoin)
  const onSortTypeChange = useViewFilterStore((state) => state.setSortType)
  const onSortOrderChange = useViewFilterStore((state) => state.setSortOrder)
  const onViewTypeChange = useViewFilterStore((state) => state.setViewType)

  const resetFilters = () => {
    setFilters([])
  }

  const getCurrentFilters = () => {
    return useViewFilterStore.getState().currentFilters
  }

  const addCurrentFilter = (filter: Filter) => {
    mog('Change Current Filter: ', { s: currentFilters, f: filter })
    setCurrentFilters([...currentFilters, filter])
  }

  const removeCurrentFilter = (filter: Filter) => {
    setCurrentFilters(currentFilters.filter((f) => f.id !== filter.id))
  }

  const changeCurrentFilter = (filter: Filter) => {
    mog(
      'Current Filter: ',
      currentFilters.map((f) => (f.id === filter.id ? filter : f))
    )
    setCurrentFilters(currentFilters.map((f) => (f.id === filter.id ? filter : f)))
  }

  const resetCurrentFilters = () => {
    setCurrentFilters([])
  }

  return {
    filters,
    sortOrder,
    sortType,
    viewType,
    globalJoin,
    currentFilters,
    setCurrentFilters,
    setFilters,
    setGlobalJoin,
    resetFilters,
    addCurrentFilter,
    removeCurrentFilter,
    changeCurrentFilter,
    resetCurrentFilters,
    onViewTypeChange,
    onSortTypeChange,
    onSortOrderChange
  }
}
