import {create} from 'zustand'

import {
  Filter,
  Filters,
  GlobalFilterJoin,
  idxKey,
  SearchFilterFunctions,
  SortOrder,
  SortType,
  SuperBlocks,
  View,
  ViewType
} from '@mexit/core'
import { SearchEntityType } from '@mexit/shared'

import { useGenericFilterFunctions } from './useFilterFunctions'

export interface FilterStore {
  /** Filters that are available for application in the current context */
  filters: Filters

  /** Filters that are applied in the current context */
  currentFilters: Filter[]

  /** Join strategy for filters */
  globalJoin: GlobalFilterJoin
  groupBy?: string
  setGroupBy?: (groupBy: string) => void

  groupingOptions?: Array<SearchEntityType>
  setGroupingOptions?: (groupingOptions: Array<SearchEntityType>) => void

  sortOptions?: Array<SearchEntityType>
  setSortOptions?: (sortOptions: Array<SearchEntityType>) => void

  setFilters: (filters: Filters) => void
  setGlobalJoin: (join: GlobalFilterJoin) => void
  setCurrentFilters: (currentFilters: Filter[]) => void

  /** Fetch results from specific indexes */
  indexes?: idxKey[]
  setIndexes?: (indexes: idxKey[]) => void

  initializeState?: (view: View) => void

  // Entity Types to show in the results
  entities?: Array<SuperBlocks>
  setEntities?: (entities: Array<SuperBlocks>) => void

  sortType?: SortType
  sortOrder?: SortOrder
  setSortType?: (sortType: SortType) => void
  setSortOrder?: (sortOrder: SortOrder) => void

  viewType?: ViewType
  setViewType?: (viewType: ViewType) => void
}

export const useFilterStoreBase = create<FilterStore>()((set) => ({
  filters: [],
  currentFilters: [],
  indexes: ['node', 'shared'],
  globalJoin: 'all',
  groupBy: undefined,
  setFilters: (filters) => set((state) => ({ ...state, filters })),
  setGlobalJoin: (join) => set((state) => ({ ...state, globalJoin: join })),
  setCurrentFilters: (currentFilters) => set((state) => ({ ...state, currentFilters })),
  setIndexes: (indexes) => set((state) => ({ ...state, indexes })),
  setSortType: (sortType) => set((state) => ({ ...state, sortType })),
  setSortOrder: (sortOrder) => set((state) => ({ ...state, sortOrder })),
  setViewType: (viewType) => set((state) => ({ ...state, viewType }))
}))

export const useFilterStore = <Slice>(selector: (state: FilterStore) => Slice) => useFilterStoreBase(selector)

export const useFilters = <Item>() => {
  const filters = useFilterStore((state) => state.filters)
  const setFilters = useFilterStore((state) => state.setFilters)
  const currentFilters = useFilterStore((state) => state.currentFilters)
  const setCurrentFilters = useFilterStore((state) => state.setCurrentFilters)
  const setGlobalJoin = useFilterStore((state) => state.setGlobalJoin)
  const globalJoin = useFilterStore((state) => state.globalJoin)

  const filterFunctions = useGenericFilterFunctions()

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

  const applyCurrentFilters = (items: Item[]) => {
    return applyFilters(items, currentFilters, filterFunctions, globalJoin)
  }

  const resetCurrentFilters = () => {
    setCurrentFilters([])
  }

  return {
    filters,
    resetFilters,
    applyCurrentFilters,
    setFilters,
    addCurrentFilter,
    changeCurrentFilter,
    currentFilters,
    removeCurrentFilter,
    resetCurrentFilters,
    globalJoin,
    setGlobalJoin
  }
}

export const applyFilters = <Item>(
  items: Item[],
  filters: Filter[],
  filterFunctions: SearchFilterFunctions,
  globalFilterJoin: GlobalFilterJoin = 'all'
): Item[] => {
  return []
}
