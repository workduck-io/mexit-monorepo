import { generateTag, getTagsFromContent, TagsCache, useDataStore } from '@mexit/core'


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

  const _getTags = (nodeid: string, tagsCache: TagsCache): string[] =>
    Object.keys(tagsCache).filter((t) => tagsCache[t].nodes.includes(nodeid))

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

  return {
    updateTagsFromContent
  }
}
