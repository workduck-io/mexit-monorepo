import { generateTag, getTagsFromContent, TagsCache, useDataStore } from '@mexit/core'

import { useAnalysisStore } from '../Stores/useAnalysis'

import { useLinks } from './useLinks'
import { useNodes } from './useNodes'

/**
  Tags req
  - getTags(nodeid: string) => string[]
  - getNodesForTag(tag: string) => string[]
 **/

export const Settify = <T>(arr: T[]): T[] => Array.from(new Set(arr))

export interface RelatedNodes {
  [tag: string]: string[]
}

export const useTags = () => {
  const updateTagsCache = useDataStore((state) => state.updateTagsCache)
  const setTags = useDataStore((state) => state.setTags)
  const { getPathFromNodeid } = useLinks()
  const { isInArchive } = useNodes()

  const _getTags = (nodeid: string, tagsCache: TagsCache): string[] =>
    Object.keys(tagsCache).filter((t) => tagsCache[t].nodes.includes(nodeid))

  const getTags = (nodeid: string, fromAnalysis = false): string[] => {
    const tagsCache = useDataStore.getState().tagsCache
    if (!fromAnalysis) {
      return _getTags(nodeid, tagsCache)
    }
    const analTags = useAnalysisStore.getState().analysis?.tags || []
    return analTags
  }

  const getAllTags = (): string[] => {
    const tagsCache = useDataStore.getState().tagsCache
    return Object.keys(tagsCache)
  }

  const hasTags = (nodeid: string): boolean => {
    const tagsCache = useDataStore.getState().tagsCache
    return _getTags(nodeid, tagsCache).length > 0
  }

  const getNodesAndCleanCacheForTag = (tag: string): { nodes: string[]; cleanCache: TagsCache } => {
    const tagsCache = useDataStore.getState().tagsCache
    const cleanCache = Object.entries(tagsCache).reduce((p, [k, v]: [k: string, v: any]) => {
      return { ...p, [k]: { nodes: v.nodes.filter((n) => !isInArchive(n)) } }
    }, {})
    if (cleanCache[tag]) return { nodes: cleanCache[tag].nodes, cleanCache }
    return { nodes: [], cleanCache }
  }

  /**
   * Produce a list of related nodes that share the same tags with the given node
   * The list is sorted by the number of common tags between the nodes
   * */
  const getRelatedNodes = (nodeid: string, fromAnalysis = false) => {
    const tagsCache = useDataStore.getState().tagsCache
    const tags = getTags(nodeid, fromAnalysis)

    /** Related nodes per tag **/
    const relatedNodes: RelatedNodes = tags.reduce((p, t) => {
      if (!tagsCache[t]) return p
      return {
        ...p,
        [t]: tagsCache[t].nodes.filter((id) => id !== nodeid && !isInArchive(id) && getPathFromNodeid(id, true))
      }
    }, {})

    const flattened: string[] = Object.keys(relatedNodes).reduce((p, c) => {
      return [...p, ...relatedNodes[c]]
    }, [])

    const count: { [nodeid: string]: number } = flattened.reduce((p, c) => {
      if (Object.keys(p).indexOf(c) > -1) {
        return {
          ...p,
          [c]: p[c] + 1
        }
      }
      return {
        ...p,
        [c]: 1
      }
    }, {})

    const relatedSorted = Array.from(new Set(flattened)).sort((a, b) => count[a] - count[b])

    // console.log('Getting relNodes for ', tagsCache, tags, ordered, flattened, relatedNodes, relatedSorted)
    return relatedSorted
  }

  const updateTagsFromContent = (nodeid: string, content: any[]) => {
    const tagsCache = useDataStore.getState().tagsCache
    const oldTags = useDataStore.getState().tags

    if (content) {
      const tags: string[] = getTagsFromContent(content)
      /*
         Here we need to remove nodeid from tags that are not present
         and add it to those that have been added
      * */
      const currentTags = _getTags(nodeid, tagsCache)
      const removedFromTags = currentTags.filter((t) => {
        return !tags.includes(t)
      })

      const newTags = tags.filter((t) => {
        return !Object.keys(tagsCache).includes(t)
      })

      const updatedTags: TagsCache = Object.keys(tagsCache).reduce((p, t) => {
        const tag = tagsCache[t]
        // If it is included in tags found in content, add it
        if (tags.includes(t)) {
          const set = Settify([...tag.nodes, nodeid])
          return {
            ...p,
            [t]: { nodes: set }
          }
        }
        // If it a tag was removed, remove it from tagCache nodes
        if (removedFromTags.includes(t)) {
          const nodes = tag.nodes.filter((n) => n !== nodeid)
          // Remove t if nodes are empty
          if (nodes.length === 0) {
            delete p[t]
            return p
          }
          return {
            ...p,
            [t]: { nodes }
          }
        }
        // Otherwise left untouched
        return {
          ...p,
          [t]: tag
        }
      }, {})

      const newCacheTags: TagsCache = newTags.reduce((p, t) => {
        return {
          ...p,
          [t]: { nodes: [nodeid] }
        }
      }, {})

      const newTagsCache = { ...updatedTags, ...newCacheTags }
      const newTagsForStore = Object.keys(newTagsCache)
      const oldTagsFromStore = oldTags.map((t) => t.value)
      const alltags = Settify([...oldTagsFromStore, ...newTagsForStore]).map(generateTag)

      // mog('We are updating', { nodeid, content, tagsCache, updatedTags, newCacheTags, alltags })
      setTags(alltags)
      updateTagsCache(newTagsCache)
    }
  }

  // Get most used tags by namespaces
  // Limits the max no. of tags to 5
  const getMostUsedTags = () => {
    const tagsCache = useDataStore.getState().tagsCache
    const ilinks = useDataStore.getState().ilinks

    // Calculate frequency of a tag in notes belonging to namespace
    const tagsWithNSFreq: Array<{ tag: string; freq: Record<string, number> }> = Object.entries(tagsCache).reduce(
      (p, [k, v]: [k: string, v: any]) => {
        const tagFreq = v.nodes.reduce((p, c) => {
          const ilink = ilinks.find((i) => i.nodeid === c)
          const ns = ilink?.namespace
          if (ns) {
            if (p[ns]) {
              return { ...p, [ns]: p[ns] + 1 }
            }
            return { ...p, [ns]: 1 }
          }
          return p
        }, {})

        return [...p, { tag: k, freq: tagFreq }]
      },
      []
    )

    // All namespaces that have tags
    const namespacesWithFreq = tagsWithNSFreq.reduce((p: string[], c) => {
      const freq = c.freq
      return [...p, ...Object.keys(freq)]
    }, [])

    const allNamespaces = Settify(namespacesWithFreq)

    // Namespaces with tag and their frequency
    const nsWithTagFreq = allNamespaces.reduce((p, nsid) => {
      const freq = tagsWithNSFreq
        .reduce((p2, t) => {
          if (t.freq[nsid] > 0) {
            return [...p2, { tag: { value: t.tag }, freq: t.freq[nsid] }]
          }
          return p2
        }, [])
        // Sort by frequency
        .sort((a, b) => b.freq - a.freq)
        // Return the tag only
        .map((t) => t.tag)
        // Limit no of results
        .slice(0, 5)

      return {
        ...p,
        [nsid]: freq
      }
    }, {})

    return nsWithTagFreq
  }

  return {
    getRelatedNodes,
    getMostUsedTags,
    getNodesAndCleanCacheForTag,
    updateTagsFromContent,
    getTags,
    getAllTags,
    hasTags
  }
}
