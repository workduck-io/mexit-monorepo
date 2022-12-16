import { Document } from '@workduck-io/flexsearch'

import { convertDataToIndexable, diskIndex, GenericSearchData, indexNames, PersistentData } from '@mexit/core'

export interface CreateSearchIndexData {
  node: GenericSearchData[] | null
  snippet: GenericSearchData[] | null
  archive: GenericSearchData[] | null
  template: GenericSearchData[] | null
}

export const SEARCH_RESULTS_LIMIT = 10
export const TITLE_RANK_BUMP = 3

export const createIndexCompositeKey = (nodeId: string, blockId: string) => {
  return `${nodeId}#${blockId}`
}

export const getNodeAndBlockIdFromCompositeKey = (compositeKey: string) => {
  const c = compositeKey.split('#')
  return { nodeId: c[0], blockId: c[1] }
}

export const indexedFields = ['title', 'text']
export const storedFields = ['text', 'data']

export const createSearchIndex = (fileData: Partial<PersistentData>) => {
  const { result: initList, nodeBlockMap: nbMap } = convertDataToIndexable(fileData)

  const idx = Object.entries(indexNames).reduce((p, c) => {
    const idxName = c[0]
    const options = {
      document: {
        id: 'blockId',
        tag: 'tag',
        index: indexedFields,
        store: storedFields
      },
      tokenize: 'full'
    }
    return { ...p, [idxName]: createGenricSearchIndex(initList[idxName], options) }
  }, diskIndex)

  return { idx, nbMap }
}

export const flexIndexKeys = [
  'title.cfg',
  'title.ctx',
  'title.map',
  'text.cfg',
  'text.ctx',
  'text.map',
  'reg',
  'store',
  'tag'
]

export const createGenricSearchIndex = (
  initList: GenericSearchData[],
  options: any = {
    document: {
      id: 'id',
      index: ['title', 'text'],
      store: ['text', 'data']
    },
    tokenize: 'full'
  }
): Document<GenericSearchData> => {
  const index = new Document<GenericSearchData>(options)

  initList.forEach((block) => {
    block.blockId = createIndexCompositeKey(block.id, block.blockId ?? block.id)
    index.add({ ...block, tag: [block.id, ...(block.tag ?? [])] })
  })

  return index
}

export const exportAsync = (index) => {
  const idxResult = {}
  return new Promise<any>((resolve, reject) => {
    try {
      return index.export(async (key, data) => {
        try {
          idxResult[key] = data
          if (key === 'store') {
            // Hacky Fix: store is the last key that is exported so we resolve when store finishes exporting
            resolve(idxResult)
          }
        } catch (err) {
          reject(err)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const exportIndex = async (indexEntries) => {
  const result = diskIndex

  for (const [idxName, idxVal] of indexEntries) {
    result[idxName] = await exportAsync(idxVal)
  }
  return result
}
