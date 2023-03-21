import { Indexes, ISearchQuery, IUpdateDoc, SearchResult, SearchX } from '@workduck-io/mex-search'

import { ILink, mog, PersistentData } from '@mexit/core'

import { exposeX } from './worker-utils'

let searchX = new SearchX()

let hasInitialized = false

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
        contents: { contents: fileData.contents },
        snippets: {
          contents: fileData.snippets
        }
      })
      hasInitialized = true
    } catch (err) {
      console.log('Error initializing search', err)
    }

    // // searchX.initializeHighlights(fileData.highlights)
    // const { idx, nbMap } = createSearchIndex(fileData)

    // globalSearchIndex = idx
    // nodeBlockMapping = nbMap
  },
  reset: () => {
    hasInitialized = false
    searchX = new SearchX()
  },
  addDoc: (doc: IUpdateDoc) => {
    if (doc.indexKey === Indexes.ARCHIVE) console.log('Adding Archive Doc', { id: doc.id, contents: doc.contents })

    searchX.addOrUpdateDocument(doc)
  },
  updateBlock: (doc: IUpdateDoc) => {
    searchX.appendToDoc(doc)
  },
  updateDoc: (doc: IUpdateDoc) => {
    if (doc.indexKey === Indexes.ARCHIVE) console.log('Updating Archive Doc', { id: doc.id, contents: doc.contents })
    searchX.addOrUpdateDocument(doc)
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

  // TODO: Figure out tags with this OR approach
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

      // * TODO: Enable multi query search
      // const words = query.split(' ')
      // const searchItems = []

      // indexedFields.forEach((field) => {
      //   words.forEach((w) => {
      //     const t = {
      //       field,
      //       query: w
      //     }
      //     searchItems.push(t)
      //   })
      // })

      // const searchQuery = {
      //   index: searchItems,
      //   enrich: true
      // }

      // let response: any[] = []

      // if (typeof key === 'string') {
      //   response = globalSearchIndex[key].search(searchQuery)
      // } else {
      //   key.forEach((k) => {
      //     response = [...response, ...globalSearchIndex[k].search(searchQuery)]
      //   })
      // }

      // const results = new Array<any>()
      // const rankingMap: { [k: string]: number } = {}

      // response.forEach((entry) => {
      //   const matchField = entry.field
      //   entry.result.forEach((i) => {
      //     const { nodeId, blockId } = getNodeAndBlockIdFromCompositeKey(i.id)
      //     if (rankingMap[nodeId]) rankingMap[nodeId]++
      //     else rankingMap[nodeId] = 1
      //     results.push({ id: nodeId, data: i.doc?.data, blockId, text: i.doc?.text?.slice(0, 100), matchField })
      //   })
      // })

      // const combinedResults = new Array<GenericSearchResult>()
      // results.forEach(function (item) {
      //   const existing = combinedResults.filter(function (v, i) {
      //     return v.id === item.id
      //   })
      //   if (existing.length) {
      //     const existingIndex = combinedResults.indexOf(existing[0])
      //     if (!combinedResults[existingIndex].matchField.includes(item.matchField))
      //       combinedResults[existingIndex].matchField = combinedResults[existingIndex].matchField.concat(
      //         item.matchField
      //       )
      //   } else {
      //     if (typeof item.matchField == 'string') item.matchField = [item.matchField]
      //     combinedResults.push(item)
      //   }
      // })

      // const sortedResults = combinedResults.sort((a, b) => {
      //   const titleBumpA = a.matchField.includes('title') ? TITLE_RANK_BUMP : 0
      //   const titleBumpB = b.matchField.includes('title') ? TITLE_RANK_BUMP : 0
      //   const rankA = rankingMap[a.id] + titleBumpA
      //   const rankB = rankingMap[b.id] + titleBumpB

      //   if (rankA > rankB) return -1
      //   else if (rankA < rankB) return 1
      //   else return a.matchField.length >= b.matchField.length ? -1 : 1
      // })

      // return sortedResults.slice(0, SEARCH_RESULTS_LIMIT)
    } catch (e) {
      mog('Searching Broke:', { e })
      return []
    }
  }
}

export type SearchWorkerInterface = typeof searchWorker
exposeX(searchWorker)
