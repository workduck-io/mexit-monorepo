import { useState } from 'react'
import create from 'zustand'

import { mog } from '@mexit/shared'

import { getAllParentIds, isElder } from '../Utils/treeUtils'
import useDataStore from '../Stores/useDataStore'
import { GenericSearchResult } from '../Types/Search'
import { useLinks } from './useLinks'
import { useTags } from './useTags'
// import create from 'zustand'

/*
- Date
- Node level
- Tag based
- Show only relevant options - Filter options that are empty
- Sorting [:?]
*/

export type FilterKey = 'node' | 'tag' | 'date'
export interface SearchFilter<Item> {
  key: FilterKey
  id: string
  label: string
  filter: (item: Item) => boolean | number
  icon?: string
  // sort: 'asc' | 'desc'
}

interface FilterStore<Item> {
  filters: SearchFilter<Item>[]
  currentFilters: SearchFilter<Item>[]
  setFilters: (filters: SearchFilter<Item>[]) => void
  setCurrentFilters: (currentFilters: SearchFilter<Item>[]) => void
}

export const useFilterStoreBase = create<FilterStore<any>>((set) => ({
  filters: [],
  currentFilters: [],
  setFilters: (filters) => set((state) => ({ ...state, filters })),
  setCurrentFilters: (currentFilters) => set((state) => ({ ...state, currentFilters }))
}))

export const useFilterStore = <Item, Slice>(selector: (state: FilterStore<Item>) => Slice) =>
  useFilterStoreBase(selector)

export const useFilters = <Item,>() => {
  const filters = useFilterStore((state) => state.filters) as SearchFilter<Item>[]
  const setFilters = useFilterStore((state) => state.setFilters) as (filters: SearchFilter<Item>[]) => void
  const currentFilters = useFilterStore((state) => state.currentFilters) as SearchFilter<Item>[]
  const setCurrentFilters = useFilterStore((state) => state.setCurrentFilters) as (
    currentFilters: SearchFilter<Item>[]
  ) => void
  const { getTags } = useTags()

  const { getPathFromNodeid } = useLinks()
  // setFilters: (filters: SearchFilter<any>[]) => void
  const addFilter = (filter: SearchFilter<Item>) => {
    setFilters([...filters, filter])
  }

  const resetFilters = () => {
    setFilters([])
  }

  const addCurrentFilter = (filter: SearchFilter<Item>) => {
    setCurrentFilters([...currentFilters, filter])
  }

  const removeCurrentFilter = (filter: SearchFilter<Item>) => {
    setCurrentFilters(currentFilters.filter((f) => f.id !== filter.id))
  }

  const applyCurrentFilters = (items: Item[]) => {
    return applyFilters(items, currentFilters)
  }

  const resetCurrentFilters = () => {
    setCurrentFilters([])
  }

  const generateTagFilters = (items: GenericSearchResult[]) => {
    const tagsCache = useDataStore.getState().tagsCache
    // OK
    const currentFilters_ = currentFilters as unknown as SearchFilter<GenericSearchResult>[]
    const filteredItems = currentFilters_.length > 0 ? applyFilters(items, currentFilters_) : items

    const rankedTags = filteredItems.reduce((acc, item) => {
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

    const tagsFilter: SearchFilter<GenericSearchResult>[] = Object.entries(rankedTags).reduce(
      (p: SearchFilter<GenericSearchResult>[], [tag, rank]) => {
        const tags = tagsCache[tag]
        if (rank > 1)
          return [
            ...p,
            {
              key: 'tag',
              icon: 'ri:hashtag',
              id: `tag_filter_${tag}`,
              label: tag,
              filter: (item: GenericSearchResult) => {
                return tags && tags.nodes.includes(item.id)
              }
            }
          ]
        else return p
      },
      []
    )

    // mog('tagsFilter', { tagsCache, currentFilters_, rankedTags, tagsFilter })
    return tagsFilter
  }

  const generateNodeFilters = (items: GenericSearchResult[]) => {
    // Known
    const currentFilters_ = currentFilters as unknown as SearchFilter<GenericSearchResult>[]
    const filteredItems = currentFilters_.length > 0 ? applyFilters(items, currentFilters_) : items
    const rankedPaths = filteredItems.reduce((acc, item) => {
      const path = getPathFromNodeid(item.id)
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

    const nodeFilters = Object.entries(rankedPaths).reduce((acc, c) => {
      const [path, rank] = c
      if (rank > 1) {
        // mog('path', { path, rank })
        acc.push({
          key: 'node',
          id: `node_${path}`,
          icon: 'ri:file-list-2-line',
          label: path,
          filter: (item: GenericSearchResult) => {
            const itemPath = getPathFromNodeid(item.id)
            mog('itemPath being filtered', { item, itemPath, path })
            return isElder(itemPath, path) || itemPath === path
          }
        })
      }
      return acc
    }, [] as SearchFilter<GenericSearchResult>[])

    // mog('nodeFilters', { nodeFilters })
    return nodeFilters
  }

  const generateNodeSearchFilters = (items: GenericSearchResult[]) => {
    const nodeFilters = generateNodeFilters(items)
    const tagFilters = generateTagFilters(items)
    return [...nodeFilters, ...tagFilters]
  }

  return {
    addFilter,
    filters,
    resetFilters,
    applyCurrentFilters,
    setFilters,
    generateNodeFilters,
    generateTagFilters,
    addCurrentFilter,
    currentFilters,
    removeCurrentFilter,
    generateNodeSearchFilters,
    resetCurrentFilters
  }
}

export const applyFilters = <Item,>(items: Item[], filters: SearchFilter<Item>[]): Item[] => {
  const filtered = filters.reduce((acc, filter) => {
    return acc.filter(filter.filter)
  }, items)

  mog('applyFilters', { items, filters, filtered })
  return filtered
}
