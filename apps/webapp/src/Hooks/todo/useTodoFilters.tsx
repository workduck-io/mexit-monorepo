import create from 'zustand'
import createContext from 'zustand/context'
import { devtools } from 'zustand/middleware'

import { Entities } from '@workduck-io/mex-search'

import { Filter, Filters, GlobalFilterJoin, mog, View, ViewType } from '@mexit/core'
import { SearchEntityType } from '@mexit/shared'

import { FilterStore } from '../useFilters'

export const { Provider: ViewFilterProvider, useStore: useViewFilterStore } = createContext<FilterStore>()

export const createViewFilterStore = () =>
  create<FilterStore>(
    devtools(
      (set) => ({
        filters: [],
        currentFilters: [],
        setCurrentFilters: (filters: Filter[]) => set({ currentFilters: filters }),
        globalJoin: 'all',
        sortType: 'status',
        sortOrder: 'ascending',
        entities: [],
        setEntities: (entities: Array<Entities>) => set({ entities }),
        initializeState: (view: View) => {
          set({
            entities: view.entities ?? [],
            currentFilters: view.filters,
            globalJoin: view.globalJoin,
            viewType: view.viewType,
            groupBy: view.groupBy,
            sortOrder: view.sortOrder ?? 'ascending'
          })
        },
        setGroupBy: (groupBy: string) => set({ groupBy }),
        setGroupingOptions: (groupingOptions: SearchEntityType[]) => set({ groupingOptions }),
        setSortOptions: (sortOptions: SearchEntityType[]) => set({ sortOptions }),
        setGlobalJoin: (join: GlobalFilterJoin) => set({ globalJoin: join }),
        indexes: [],
        setIndexes: () => undefined,
        viewType: ViewType.List,
        setViewType: (viewType: ViewType) => set({ viewType }),
        setFilters: (filters: Filters) => set({ filters }),
        setSortType: (sortType) => set((state) => ({ ...state, sortType })),
        setSortOrder: (sortOrder) => set((state) => ({ ...state, sortOrder }))
      }),
      {
        name: 'mexit-view-filters-store'
      }
    )
  )

export const useViewFilters = () => {
  const filters = useViewFilterStore((state) => state.filters)
  const onChangeEntities = useViewFilterStore((state) => state.setEntities)
  const currentFilters = useViewFilterStore((state) => state.currentFilters)
  const entities = useViewFilterStore((store) => store.entities)
  const globalJoin = useViewFilterStore((state) => state.globalJoin)
  const sortOrder = useViewFilterStore((state) => state.sortOrder)
  const sortType = useViewFilterStore((state) => state.sortType)
  const groupBy = useViewFilterStore((state) => state.groupBy)
  const viewType = useViewFilterStore((state) => state.viewType)
  const setCurrentFilters = useViewFilterStore((state) => state.setCurrentFilters)
  const setFilters = useViewFilterStore((s) => s.setFilters)
  const onGroupByChange = useViewFilterStore((s) => s.setGroupBy)
  const initViewFilters = useViewFilterStore((store) => store.initializeState)
  const setGlobalJoin = useViewFilterStore((state) => state.setGlobalJoin)
  const onSortTypeChange = useViewFilterStore((state) => state.setSortType)
  const onSortOrderChange = useViewFilterStore((state) => state.setSortOrder)
  const onViewTypeChange = useViewFilterStore((state) => state.setViewType)
  const setGroupingOptions = useViewFilterStore((state) => state.setGroupingOptions)

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
    onChangeEntities,
    initViewFilters,
    sortType,
    viewType,
    globalJoin,
    currentFilters,
    setCurrentFilters,
    setFilters,
    setGlobalJoin,
    resetFilters,
    entities,
    addCurrentFilter,
    removeCurrentFilter,
    changeCurrentFilter,
    groupBy,
    onGroupByChange,
    setGroupingOptions,
    resetCurrentFilters,
    onViewTypeChange,
    onSortTypeChange,
    onSortOrderChange
  }
}
