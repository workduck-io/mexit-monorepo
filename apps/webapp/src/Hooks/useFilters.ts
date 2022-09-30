import create from 'zustand'

import {
  GenericSearchResult,
  mog,
  SearchFilter,
  isElder,
  getAllParentPaths,
  FilterTypeWithOptions,
  getAllParentIds,
  Filter,
  GlobalFilterJoin,
  SearchFilterFunctions,
  Filters,
  idxKey
} from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useGenericFilterFunctions } from './useFilterFunctions'
import { getTitleFromPath, useLinks } from './useLinks'
import { useTags } from './useTags'

export interface FilterStore {
  filters: Filters
  currentFilters: Filter[]
  globalJoin: GlobalFilterJoin
  indexes?: idxKey[]
  setIndexes?: (indexes: idxKey[]) => void
  setFilters: (filters: Filters) => void
  setGlobalJoin: (join: GlobalFilterJoin) => void
  setCurrentFilters: (currentFilters: Filter[]) => void
}

export const useFilterStoreBase = create<FilterStore>((set) => ({
  filters: [],
  currentFilters: [],
  indexes: ['node', 'shared'],
  globalJoin: 'all',
  setFilters: (filters) => set((state) => ({ ...state, filters })),
  setGlobalJoin: (join) => set((state) => ({ ...state, globalJoin: join })),
  setCurrentFilters: (currentFilters) => set((state) => ({ ...state, currentFilters })),
  setIndexes: (indexes) => set((state) => ({ ...state, indexes }))
}))

export const useFilterStore = <Slice>(selector: (state: FilterStore) => Slice) => useFilterStoreBase(selector)

export const useFilters = <Item>() => {
  const filters = useFilterStore((state) => state.filters)
  const setFilters = useFilterStore((state) => state.setFilters)
  const currentFilters = useFilterStore((state) => state.currentFilters)
  const setCurrentFilters = useFilterStore((state) => state.setCurrentFilters)
  const setGlobalJoin = useFilterStore((state) => state.setGlobalJoin)
  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const namespaces = useDataStore((state) => state.namespaces)
  const globalJoin = useFilterStore((state) => state.globalJoin)

  const { getTags } = useTags()

  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const filterFunctions = useGenericFilterFunctions()

  const resetFilters = () => {
    setFilters([])
  }

  const addCurrentFilter = (filter: Filter) => {
    // mog('addCurrentFilter', { filter })
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

  const generateTagFilters = (items: GenericSearchResult[]) => {
    const rankedTags = items.reduce((acc, item) => {
      const tags = getTags(item.id)
      if (tags) {
        tags.forEach((tag) => {
          if (!acc[tag]) {
            acc[tag] = 1
          } else {
            acc[tag] += 1
          }
        })
      }
      return acc
    }, {} as { [tag: string]: number })

    const tagsFilter: FilterTypeWithOptions = tags.reduce(
      (p: FilterTypeWithOptions, t) => {
        // const tags = tagsCache[tag]
        const rank = rankedTags[t?.value] || 0
        if (rank >= 0 && t?.value)
          return {
            ...p,
            options: [
              ...p.options,
              {
                id: `tag_filter_${t.value}`,
                label: t.value,
                count: rank as number,
                value: t.value
              }
            ]
          }
        else return p
      },
      {
        type: 'tag',
        label: 'Tags',
        options: []
      }
    )

    return tagsFilter
  }

  const generateNodeFilters = (items: GenericSearchResult[]) => {
    const rankedPaths = items.reduce((acc, item) => {
      const path = getPathFromNodeid(item.id, true)
      const allPaths = getAllParentIds(path)
      // const allPaths =
      allPaths.forEach((path) => {
        if (acc[path]) {
          acc[path] += 1
        } else {
          acc[path] = 1
        }
      })
      return acc
    }, {} as { [path: string]: number })

    const nodeFilters: FilterTypeWithOptions = ilinks.reduce(
      (acc: FilterTypeWithOptions, ilink) => {
        const rank = rankedPaths[ilink?.path] || 0
        if (rank >= 0) {
          acc.options.push({
            id: `node_${ilink.path}`,
            value: ilink.path,
            label: getTitleFromPath(ilink.path),
            count: rank as number
          })
        }
        return acc
      },
      {
        type: 'note',
        label: 'Notes',
        options: []
      } as FilterTypeWithOptions
    )

    return nodeFilters
  }

  const generateNamespaceFilters = <T extends { id: string }>(items: T[]) => {
    const rankedNamespaces = items.reduce((acc, item) => {
      const node = getILinkFromNodeid(item.id, true)
      const namespace = node?.namespace

      if (namespace) {
        if (!acc[namespace]) {
          acc[namespace] = 1
        } else {
          acc[namespace] += 1
        }
      }

      return acc
    }, {} as { [namespace: string]: number })

    const namespaceFilters = namespaces.reduce(
      (acc, namespace) => {
        const rank = rankedNamespaces[namespace?.id] || 0
        const namespaceID = namespace?.id
        if (rank >= 0 && namespace) {
          // mog('path', { path, rank })
          acc.options.push({
            id: `namespace_${namespace.id}`,
            // Use Namespace icon
            value: namespaceID,
            label: namespace?.name,
            count: rank as number
          })
        }
        return acc
      },
      {
        type: 'space',
        label: 'Spaces',
        options: []
      } as FilterTypeWithOptions
    )

    // mog('nodeFilters', { nodeFilters })
    return namespaceFilters
  }

  const generateNodeSearchFilters = (items: GenericSearchResult[]) => {
    const nodeFilters = generateNodeFilters(items)
    const tagFilters = generateTagFilters(items)
    const namespaceFilters = generateNamespaceFilters(items)
    return [nodeFilters, tagFilters, namespaceFilters]
  }

  return {
    filters,
    resetFilters,
    applyCurrentFilters,
    setFilters,
    generateNodeFilters,
    generateTagFilters,
    addCurrentFilter,
    changeCurrentFilter,
    currentFilters,
    removeCurrentFilter,
    generateNodeSearchFilters,
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
  // TODO: Insert the global any and all filters match condition here
  if (filters.length === 0) return items

  // For any
  if (globalFilterJoin === 'any') {
    return items.filter((item) => {
      return filters.some((filter) => {
        return filterFunctions[filter.type](item, filter)
      })
    })
  }

  // For all
  const filtered = filters.reduce((acc, filter) => {
    return acc.filter((i) => filterFunctions[filter.type](i, filter))
  }, items)

  return filtered
}
