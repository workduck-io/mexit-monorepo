import md5 from 'md5'
import create from 'zustand'
import { groupBy } from 'lodash'

import {
  API,
  extractLinksFromData,
  Filter,
  Filters,
  FilterTypeWithOptions,
  generateFilterId,
  GlobalFilterJoin,
  Link,
  mog,
  Settify,
  URL_DOMAIN_REG
} from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { useDataStore } from '../Stores/useDataStore'
import { useHighlightStore2 } from '../Stores/useHighlightStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useLinkFilterFunctions } from './useFilterFunctions'
import { applyFilters, FilterStore } from './useFilters'

export const useLinkURLs = () => {
  const links = useLinkStore((store) => store.links)
  const tags = useDataStore((store) => store.tags)
  const setLinks = useLinkStore((store) => store.setLinks)
  const getHighlightsOfUrl = useHighlightStore2((state) => state.getHighlightsOfUrl)

  const { saveLink, deleteLink: deleteLinkAPI } = useURLsAPI()

  const getTags = (present?: string[]) => {
    const linkTags = links.reduce((acc, link) => {
      if (link.tags) {
        acc.push(...link.tags)
      }
      return acc
    }, [] as string[])

    const mergedTags = Settify([...linkTags, ...tags.map((t) => t.value)])
      .filter((tag) => (present ? !present.includes(tag) : true))
      .map((t) => ({ value: t }))

    return mergedTags
  }

  const getGroupedHighlights = (link: Link) => {
    const highlightOfUrl = getHighlightsOfUrl(link.url)

    if (highlightOfUrl) {
      return highlightOfUrl
    }
  }

  const addTag = (linkurl: string, tag: string) => {
    const newLinks = links.map((l) => {
      if (l.url === linkurl) {
        return { ...l, tags: Settify([...(l.tags ?? []), tag]) }
      }
      return l
    })

    const newLink = newLinks.find((l) => l.url === linkurl)
    saveLink(newLink)
    mog('addTag', { linkurl, tag, newLinks })
    setLinks(newLinks)
  }

  const removeTag = (linkurl: string, tag: string) => {
    const newLinks = links.map((l) => {
      if (l.url === linkurl) {
        return { ...l, tags: (l.tags ?? []).filter((t) => t !== tag) }
      }
      return l
    })

    const newLink = newLinks.find((l) => l.url === linkurl)
    saveLink(newLink)
    mog('removeTag', { linkurl, tag, newLinks })
    setLinks(newLinks)
  }

  const isDuplicateAlias = (alias: string): boolean => {
    return !!links.some((l) => l.alias === alias)
  }

  const updateAlias = (linkurl: string, alias: string) => {
    const newLinks = links.map((l) => {
      if (l.url === linkurl) {
        return { ...l, alias: alias }
      }
      return l
    })

    const newLink = newLinks.find((l) => l.url === linkurl)
    saveLink(newLink)
    mog('updateAlias', { linkurl, alias, newLinks })
    setLinks(newLinks)
  }

  const deleteLink = (linkurl: string) => {
    const toDelete = links.find((l) => l.url === linkurl)
    const newLinks = links.filter((l) => l.url !== linkurl)
    mog('deleteLink', { linkurl, toDelete, newLinks })
    deleteLinkAPI(toDelete)
    setLinks(newLinks)
  }

  const getLink = (linkurl: string) => {
    return links.find((l) => l.url === linkurl)
  }

  return {
    getTags,
    addTag,
    removeTag,
    updateAlias,
    isDuplicateAlias,
    deleteLink,
    getLink,
    getGroupedHighlights
  }
}

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

const getDomain = (url: string) => {
  const match = url.match(URL_DOMAIN_REG)
  if (match) {
    return match[1]
  }
}

export const useURLFilters = () => {
  const setFilters = useURLsFilterStore((state) => state.setFilters)
  const setCurrentFilters = useURLsFilterStore((state) => state.setCurrentFilters)
  const setGlobalJoin = useURLsFilterStore((state) => state.setGlobalJoin)
  const filters = useURLsFilterStore((state) => state.filters)
  const currentFilters = useURLsFilterStore((state) => state.currentFilters)
  const globalJoin = useURLsFilterStore((state) => state.globalJoin)
  const tags = useDataStore((state) => state.tags)
  const links = useLinkStore((state) => state.links)
  const getHighlightsOfUrl = useHighlightStore2((state) => state.getHighlightsOfUrl)
  const linkFilterFunctions = useLinkFilterFunctions()

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

    const shortendCount = links.reduce((acc, link) => {
      if (link.alias) {
        acc += 1
      }
      return acc
    }, 0)

    const highlightsCount = links.reduce((acc, link) => {
      const urlHighlights = getHighlightsOfUrl(link.url)
      if (urlHighlights?.length > 0) {
        acc += 1
      }
      return acc
    }, 0)

    const hasHighlightsFilter = {
      type: 'has' as const,
      label: 'Has',
      options: [
        {
          id: 'block_highlights',
          label: 'Highlights',
          count: highlightsCount,
          value: 'highlights'
        },
        {
          id: 'block_shortend',
          label: 'Shortened URL',
          count: shortendCount,
          value: 'alias'
        }
      ]
    }

    const rankedDomains = links.reduce((acc, link) => {
      const domain = getDomain(link.url)
      // mog('domain', { domain, link })
      if (!domain) return acc
      if (acc[domain]) {
        acc[domain] += 1
      } else {
        acc[domain] = 1
      }
      return acc
    }, {} as { [domain: string]: number })

    const domainFilters = Object.keys(rankedDomains).reduce(
      (acc, c) => {
        const rank = rankedDomains[c] ?? 0
        const domain = c
        // const [tag, rank] = c
        if (rank >= 0 && acc.options.findIndex((o) => o.value === domain) === -1) {
          acc.options.push({
            id: `filter_tag_${domain}`,
            label: domain,
            value: domain,
            count: rank
          })
        }
        return acc
      },
      {
        type: 'domain',
        label: 'Domain',
        options: []
      } as FilterTypeWithOptions
    )

    // mog('domains', { rankedDomains, domainFilters })
    //

    return [tagFilters, domainFilters, hasHighlightsFilter]
  }

  const applyCurrentFilters = (results: Link[]) => {
    const linksFromResults = results
      .map((result) => {
        const link = links.find((link) => link.url === result.url)
        return link
      })
      .filter((link) => !!link)

    const filteredLinks = applyFilters(linksFromResults, currentFilters, linkFilterFunctions, globalJoin)

    // mog('applyCurrentFilters', { results, linksFromResults, currentFilters, globalJoin, filteredLinks })

    return filteredLinks
  }

  const addCurrentFilter = (filter: Filter) => {
    setCurrentFilters([...currentFilters, filter])
  }

  const addTagFilter = (tag: string) => {
    const filter: Filter = {
      id: generateFilterId(),
      type: 'tag',
      values: [
        {
          id: `filter_tag_${tag}`,
          label: tag,
          value: tag
        }
      ],
      join: 'all',
      multiple: true
    }
    addCurrentFilter(filter)
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
    applyCurrentFilters,
    addTagFilter
  }
}

export const useURLsAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setLinks = useLinkStore((store) => store.setLinks)

  /**
   * Fetches all links of the workspace
   */
  const getAllLinks = async () => {
    const data = await API.link
      .getAll()
      .then((d) => {
        const links = extractLinksFromData(d)
        mog('getAllLinks', { d, links })
        return links
      })
      .then((links: Link[]) => {
        setLinks(links)
      })
      .catch(console.error)

    return data
  }

  const saveLink = async (link: Link) => {
    const req = {
      url: link.url,
      alias: link.alias,
      properties: { title: link.title },
      tags: link.tags
    }

    const data = await API.link.save(req)
    return data
  }

  const deleteLink = async (link: Link) => {
    const workspaceId = getWorkspaceId()
    // Need hashed url
    const hashedURL = md5(`${workspaceId}${link.url}`)
    const data = await API.link.delete(hashedURL)
    return data
    // OOK
  }

  return { getAllLinks, saveLink, deleteLink }
}
