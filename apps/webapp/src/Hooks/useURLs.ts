import {
  Filter,
  Filters,
  FilterTypeWithOptions,
  GenericSearchResult,
  GlobalFilterJoin,
  mog,
  Settify
} from '@mexit/core'
import create from 'zustand'
import { Link, useLinkStore } from '../Stores/useLinkStore'
import { applyFilters, FilterStore } from './useFilters'
import { useDataStore } from '../Stores/useDataStore'
import { linkFilterFunctions } from './useFilterFunctions'

export const useURLsFilterStore = create<FilterStore>((set) => ({
  currentFilters: [],
  setCurrentFilters: (filters: Filter[]) => set({ currentFilters: filters }),
  globalJoin: 'all',
  setGlobalJoin: (join: GlobalFilterJoin) => set({ globalJoin: join }),
  indexes: [],
  setIndexes: () => undefined,
  filters: [],
  setFilters: (filters: Filters) => set({ filters })
}))

export const useURLFilters = () => {
  const setFilters = useURLsFilterStore((state) => state.setFilters)
  const setCurrentFilters = useURLsFilterStore((state) => state.setCurrentFilters)
  const setGlobalJoin = useURLsFilterStore((state) => state.setGlobalJoin)
  const filters = useURLsFilterStore((state) => state.filters)
  const currentFilters = useURLsFilterStore((state) => state.currentFilters)
  const globalJoin = useURLsFilterStore((state) => state.globalJoin)
  const tags = useDataStore((state) => state.tags)
  const links = useLinkStore((state) => state.links)

  const resetFilters = () => {
    setFilters([])
  }

  const generateLinkFilters = (links: Link[]) => {
    const linkTags = links.reduce((acc, link) => {
      if (link.tags) {
        acc.push(...link.tags)
      }
      return acc
    }, [] as string[])

    const mergedTags = Settify([...linkTags, ...tags.map((tag) => tag.value)])

    const rankedTags = linkTags.reduce((acc, tag) => {
      if (!acc[tag]) {
        acc[tag] = 1
      } else {
        acc[tag] += 1
      }
      return acc
    }, {} as { [tag: string]: number })

    const tagFilters = mergedTags.reduce(
      (acc, c) => {
        const rank = rankedTags[c] ?? 0
        const tag = c
        // const [tag, rank] = c
        if (rank >= 0 && acc.options.findIndex((o) => o.value === tag) === -1) {
          acc.options.push({
            id: `filter_tag_${tag}`,
            label: tag,
            value: tag,
            count: rank
          })
        }
        return acc
      },
      {
        type: 'tag',
        label: 'Tags',
        options: []
      } as FilterTypeWithOptions
    )

    mog('tagFilters', { tagFilters, mergedTags, rankedTags, linkTags })

    const shortendCount = links.reduce((acc, link) => {
      if (link.shortend) {
        acc += 1
      }
      return acc
    }, 0)

    const hasShortenedFilter = {
      type: 'has' as const,
      label: 'Shortend',
      options: [
        {
          id: 'block_shortend',
          label: 'Shortened',
          count: shortendCount,
          value: 'block_todo'
        }
      ]
    }

    return [tagFilters, hasShortenedFilter]
  }

  const applyCurrentFilters = (results: GenericSearchResult[]) => {
    const linksFromResults = results
      .map((result) => {
        const link = links.find((link) => link.id === result.id)
        return link
      })
      .filter((link) => !!link)

    const filteredLinks = applyFilters(linksFromResults, currentFilters, linkFilterFunctions, globalJoin)

    return filteredLinks
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
    addCurrentFilter,
    removeCurrentFilter,
    changeCurrentFilter,
    resetCurrentFilters,
    resetFilters,
    filters,
    currentFilters,
    setCurrentFilters,
    globalJoin,
    setGlobalJoin,
    setFilters,
    generateLinkFilters,
    applyCurrentFilters
  }
}
