import { Indexes, ISearchQuery, IUpdateDoc, SearchResult, SearchX } from '@workduck-io/mex-search'

import { Highlight, ILink, Link, mog, PersistentData, Reminder } from '@mexit/core'

import { exposeX } from './worker-utils'

let searchX = new SearchX()

let hasInitialized = false

export interface InitializeSearchEntity {
  initializeHeirarchy: ILink[]
  initializeHighlights: Highlight[]
  initializeLinks: Link[]
  initializeReminders: Reminder[]
}

const searchWorker = {
  getInitState: () => {
    return hasInitialized
  },
  setInitState: (value: boolean) => {
    hasInitialized = value
  },
  init: (fileData: Partial<PersistentData>) => {
    if (hasInitialized) return

    try {
      searchX.initializeSearch({
        ilinks: fileData.ilinks,
        highlights: fileData.highlights,
        links: fileData.links,
        reminders: fileData.reminders,
        contents: { contents: fileData.contents } as any,
        snippets: {
          contents: fileData.snippets
        } as any
      })

      hasInitialized = true
    } catch (err) {
      console.log('Error initializing search', err)
    }
  },
  reset: () => {
    hasInitialized = false
    searchX = new SearchX()
  },
  addDoc: (doc: IUpdateDoc) => {
    searchX.addOrUpdateDocument({
      ...doc,
      contents: doc.contents?.map((item) => ({ ...item, metadata: item.metadata ?? {} }))
    })
  },
  updateBlock: (doc: IUpdateDoc) => {
    searchX.appendToDoc({
      ...doc,
      contents: doc.contents?.map((item) => ({ ...item, metadata: item.metadata ?? {} }))
    })
  },
  updateDoc: (doc: IUpdateDoc) => {
    searchX.addOrUpdateDocument({
      ...doc,
      contents: doc.contents?.map((item) => ({ ...item, metadata: item.metadata ?? {} }))
    })
  },
  updateILink: (ilink: ILink) => {
    searchX.updateIlink(ilink)
  },

  removeDoc: (indexKey: Indexes, id: string) => {
    searchX.deleteEntity(id, indexKey)
  },

  searchIndex: (indexKey: Indexes, query: ISearchQuery) => {
    try {
      const res = searchX.search({ options: query, indexKey })
      mog('SearchX Results:', { res, query })
      return res
    } catch (e) {
      mog('Searching Broke:', { e })
      return []
    }
  },

  searchIndexByNodeId: (indexKey, nodeId, query) => {
    return searchX.search({
      indexKey,
      options: [
        {
          type: 'query',
          query: [{ type: 'heirarchy', value: nodeId }, ...query]
        }
      ]
    })
  },

  initializeEntities: <T extends keyof InitializeSearchEntity>(updateType: T, data: InitializeSearchEntity[T]) => {
    return searchX[updateType](data as any)
  },

  searchIndexWithRanking: (indexKey: Indexes, query: ISearchQuery, tags?: Array<string>) => {
    try {
      const searchResults = searchX.search({ options: query, indexKey })
      mog('SearchX Results:', { searchResults, query })
      const matchedNotes = new Set<string>()

      const groupedResults = searchResults.reduce((acc, result) => {
        const noteId = result.parent
        if (!matchedNotes.has(noteId)) {
          matchedNotes.add(noteId)
          acc.push(result)
        }

        return acc
      }, [] as SearchResult[])

      return groupedResults
    } catch (e) {
      mog('Searching Broke:', { e })
      return []
    }
  }
}

export type SearchWorkerInterface = typeof searchWorker
exposeX(searchWorker)
