import {
  apiURLs,
  Filter,
  Filters,
  FilterTypeWithOptions,
  generateFilterId,
  GenericSearchResult,
  GlobalFilterJoin,
  mog,
  Settify,
  WORKSPACE_HEADER
} from '@mexit/core'
import create from 'zustand'
import { useAuthStore } from '../Stores/useAuth'
import { Link, useLinkStore } from '../Stores/useLinkStore'
import { applyFilters, FilterStore } from './useFilters'
import { useDataStore } from '../Stores/useDataStore'
import { linkFilterFunctions } from './useFilterFunctions'
import { client } from '@workduck-io/dwindle'

export const useLinkURLs = () => {
  const links = useLinkStore((store) => store.links)
  const tags = useDataStore((store) => store.tags)
  const setLinks = useLinkStore((store) => store.setLinks)

  const getTags = (present: string[]) => {
    const linkTags = links.reduce((acc, link) => {
      if (link.tags) {
        acc.push(...link.tags)
      }
      return acc
    }, [] as string[])

    const mergedTags = Settify([...linkTags, ...tags.map((t) => t.value)])
      .filter((tag) => !present.includes(tag))
      .map((t) => ({ value: t }))

    return mergedTags
  }

  const addTag = (linkurl: string, tag: string) => {
    const newLinks = links.map((l) => {
      if (l.url === linkurl) {
        return { ...l, tags: Settify([...l.tags, tag]) }
      }
      return l
    })

    mog('addTag', { linkurl, tag, newLinks })
    setLinks(newLinks)
  }

  return {
    getTags,
    addTag
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
      if (link.alias) {
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

const extractLinksFromData = (data: any): Link[] => {
  return data.URL.map((l: any) => {
    if (l) {
      /*
      {
    "modified": "2022-10-07T13:24:31.331Z",
    "properties": {
        "title": "Google"
    },
    "alias": "good",
    "expiry": 1696685071331,
    "entity": "URL",
    "workspace": "WORKSPACE_Fh6RzxkgCe6a4LtkwkELn",
    "url": "https://google.com",
    "created": "2022-10-07T13:24:31.331Z",
    "tags": [
        "XYZ",
        "YXA"
    ]
    }
      */
      const createdAtTime = new Date(l?.created)?.getTime()
      const updatedAtTime = new Date(l?.modified)?.getTime()
      return {
        title: l.properties.title,
        url: l.url,
        tags: l.tags,
        alias: l?.alias,
        createdAt: createdAtTime,
        updatedAt: updatedAtTime
      }
    } else return undefined
  }).filter((l) => !!l) as Link[]
}

export const useURLsAPI = () => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const setLinks = useLinkStore((store) => store.setLinks)

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  /**
   * Fetches all links of the workspace
   */
  const getAllLinks = async () => {
    const data = await client
      .get(apiURLs.links.getLinks(getWorkspaceId()), {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        const links = extractLinksFromData(d.data)
        mog('getAllLinks', { d, links })
        return links
      })
      .then((links: Link[]) => {
        setLinks(links)
      })
      .catch((e) => {
        console.error(e)
      })

    return data
  }

  const saveLink = async (link: Link) => {
    const req = {
      workspace: getWorkspaceId(),
      url: link.url,
      alias: link.alias,
      properties: { title: link.title },
      tags: link.tags
    }

    const data = await client
      .post(apiURLs.links.saveLink, req, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        mog('saveLink', d)
        return d.data
      })
    return data
  }

  const shortenLink = async (url: string) => {
    const links = useLinkStore.getState().links
    const existingLink = links.find((link) => link.url === url)
  }

  return { getAllLinks, saveLink }
}
