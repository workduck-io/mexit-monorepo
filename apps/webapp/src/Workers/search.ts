import { exposeShared } from '@workduck-io/mex-threads.js/worker'

import { GenericSearchResult, idxKey, mog, parseNode, PersistentData, SearchIndex, SearchRepExtra } from '@mexit/core'

import {
  createIndexCompositeKey,
  createSearchIndex,
  getNodeAndBlockIdFromCompositeKey,
  indexedFields,
  SEARCH_RESULTS_LIMIT,
  TITLE_RANK_BUMP
} from '../Utils/flexsearch'

let globalSearchIndex: SearchIndex = null
let nodeBlockMapping: { [key: string]: string[] } = null

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
    const { idx, nbMap } = createSearchIndex(fileData)

    globalSearchIndex = idx
    nodeBlockMapping = nbMap
    hasInitialized = true
  },

  addDoc: (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title = '',
    tags: Array<string> = [],
    extra?: SearchRepExtra
  ) => {
    if (globalSearchIndex[key]) {
      const parsedBlocks = parseNode(nodeId, contents, title, extra)

      const blockIds = parsedBlocks.map((block) => block.id)
      nodeBlockMapping[nodeId] = blockIds

      parsedBlocks.forEach((block) => {
        block.blockId = createIndexCompositeKey(nodeId, block.blockId)
        globalSearchIndex[key].add({ ...block, tag: [...tags, nodeId] })
      })
    }
  },

  updateDoc: (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title = '',
    tags: Array<string> = [],
    extra?: SearchRepExtra
  ) => {
    if (globalSearchIndex[key]) {
      const parsedBlocks = parseNode(nodeId, contents, title, extra)

      const existingNodeBlocks = nodeBlockMapping[nodeId] ?? []
      const newBlockIds = parsedBlocks.map((block) => block.blockId)

      const blockIdsToBeDeleted = existingNodeBlocks.filter((id) => !newBlockIds.includes(id))

      nodeBlockMapping[nodeId] = newBlockIds

      blockIdsToBeDeleted.forEach((blockId) => {
        const compositeKey = createIndexCompositeKey(nodeId, blockId)
        globalSearchIndex[key].remove(compositeKey)
      })

      parsedBlocks.forEach((block) => {
        block.blockId = createIndexCompositeKey(nodeId, block.blockId)
        // mog(`${block.title} updating block`, { block })
        globalSearchIndex[key].update({ ...block, tag: [...tags, nodeId] })
      })
    }
  },

  removeDoc: (key: idxKey, id: string) => {
    if (globalSearchIndex[key]) {
      const blockIds = nodeBlockMapping[id]

      delete nodeBlockMapping[id]

      blockIds?.forEach((blockId) => {
        const compositeKey = createIndexCompositeKey(id, blockId)
        globalSearchIndex[key].remove(compositeKey)
      })
    }
  },

  searchIndex: (key: idxKey | idxKey[], query: string, tags: Array<string> = []) => {
    try {
      let response: any[] = []

      if (typeof key === 'string') {
        response = globalSearchIndex[key].search(query, { enrich: true, tag: tags })
      } else {
        key.forEach((k) => {
          response = [...response, ...globalSearchIndex[k].search(query, { enrich: true, tag: tags })]
        })
      }

      const results = new Array<any>()
      response.forEach((entry) => {
        const matchField = entry.field
        entry.result.forEach((i) => {
          const { nodeId, blockId } = getNodeAndBlockIdFromCompositeKey(i.id)
          results.push({ id: nodeId, data: i.doc?.data, blockId, text: i.doc?.text?.slice(0, 100), matchField })
        })
      })

      const combinedResults = new Array<GenericSearchResult>()
      results.forEach(function (item) {
        const existing = combinedResults.filter(function (v, i) {
          return v.id === item.id
        })
        if (existing.length) {
          const existingIndex = combinedResults.indexOf(existing[0])
          if (!combinedResults[existingIndex].matchField.includes(item.matchField))
            combinedResults[existingIndex].matchField = combinedResults[existingIndex].matchField.concat(
              item.matchField
            )
        } else {
          if (typeof item.matchField == 'string') item.matchField = [item.matchField]
          combinedResults.push(item)
        }
      })

      return combinedResults
    } catch (e) {
      mog('Searching Broke:', { e })
      return []
    }
  },

  // dumpIndexDisk: async (location: string) => {
  //   const indexEntries = Object.entries(globalSearchIndex)
  //   const indexDump = await exportIndex(indexEntries)

  //   setSearchIndexData(indexDump, location)
  // },

  searchIndexByNodeId: (key, nodeId, query) => {
    try {
      let response: any[] = []

      if (typeof key === 'string') {
        response = globalSearchIndex[key].search(query, { enrich: true, tag: nodeId, index: 'text' })
      } else {
        key.forEach((k) => {
          response = [...response, ...globalSearchIndex[k].search(query, { enrich: true, tag: nodeId, index: 'text' })]
        })
      }

      const results = new Array<any>()
      response.forEach((entry) => {
        const matchField = entry.field
        entry.result.forEach((i) => {
          const { nodeId, blockId } = getNodeAndBlockIdFromCompositeKey(i.id)
          results.push({ id: nodeId, blockId, data: i.doc?.data, text: i.doc?.text?.slice(0, 100), matchField })
        })
      })

      const combinedResults = new Array<GenericSearchResult>()
      results.forEach(function (item) {
        const existing = combinedResults.filter(function (v, i) {
          return v.blockId === item.blockId
        })
        if (existing.length) {
          const existingIndex = combinedResults.indexOf(existing[0])
          combinedResults[existingIndex].matchField = combinedResults[existingIndex].matchField.concat(item.matchField)
        } else {
          if (typeof item.matchField == 'string') item.matchField = [item.matchField]
          combinedResults.push(item)
        }
      })

      mog('RESULTS', { combinedResults })

      return combinedResults
    } catch (e) {
      mog('Searching Broke:', { e })
      return []
    }
  },
  // TODO: Figure out tags with this OR approach
  searchIndexWithRanking: (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
    try {
      const words = query.split(' ')
      const searchItems = []

      indexedFields.forEach((field) => {
        words.forEach((w) => {
          const t = {
            field,
            query: w
          }
          searchItems.push(t)
        })
      })

      const searchQuery = {
        index: searchItems,
        enrich: true
      }

      let response: any[] = []

      if (typeof key === 'string') {
        response = globalSearchIndex[key].search(searchQuery)
      } else {
        key.forEach((k) => {
          response = [...response, ...globalSearchIndex[k].search(searchQuery)]
        })
      }

      const results = new Array<any>()
      const rankingMap: { [k: string]: number } = {}

      response.forEach((entry) => {
        const matchField = entry.field
        entry.result.forEach((i) => {
          const { nodeId, blockId } = getNodeAndBlockIdFromCompositeKey(i.id)
          if (rankingMap[nodeId]) rankingMap[nodeId]++
          else rankingMap[nodeId] = 1
          results.push({ id: nodeId, data: i.doc?.data, blockId, text: i.doc?.text?.slice(0, 100), matchField })
        })
      })

      const combinedResults = new Array<GenericSearchResult>()
      results.forEach(function (item) {
        const existing = combinedResults.filter(function (v, i) {
          return v.id === item.id
        })
        if (existing.length) {
          const existingIndex = combinedResults.indexOf(existing[0])
          if (!combinedResults[existingIndex].matchField.includes(item.matchField))
            combinedResults[existingIndex].matchField = combinedResults[existingIndex].matchField.concat(
              item.matchField
            )
        } else {
          if (typeof item.matchField == 'string') item.matchField = [item.matchField]
          combinedResults.push(item)
        }
      })

      const sortedResults = combinedResults.sort((a, b) => {
        const titleBumpA = a.matchField.includes('title') ? TITLE_RANK_BUMP : 0
        const titleBumpB = b.matchField.includes('title') ? TITLE_RANK_BUMP : 0
        const rankA = rankingMap[a.id] + titleBumpA
        const rankB = rankingMap[b.id] + titleBumpB

        if (rankA > rankB) return -1
        else if (rankA < rankB) return 1
        else return a.matchField.length >= b.matchField.length ? -1 : 1
      })
      mog('SortedResults', { sortedResults })

      return sortedResults.slice(0, SEARCH_RESULTS_LIMIT)
    } catch (e) {
      mog('Searching Broke:', { e })
      return []
    }
  }
}

export type SearchWorkerInterface = typeof searchWorker
exposeShared(searchWorker)
