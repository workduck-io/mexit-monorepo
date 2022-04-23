import { GenericSearchData, FileData, mog, diskIndex, indexNames } from '@mexit/core'
import { convertDataToIndexable } from '@mexit/shared'
import { Document } from 'flexsearch'

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

export const createSearchIndex = (fileData: FileData, data: CreateSearchIndexData) => {
  // TODO: Find a way to delay the conversion until needed i.e. if index is not present
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
    return { ...p, [idxName]: createGenricSearchIndex(initList[idxName], data[idxName] ?? null, options) }
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
  indexData: any,
  // Default options for node search
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

  if (indexData && Object.keys(indexData).length > 0) {
    // When using a prebuilt index read from disk present in the indexData parameter
    mog('Using Prebuilt Index!', {})
    Object.entries(indexData).forEach(([key, data]) => {
      const parsedData = JSON.parse((data as string) ?? '') ?? null
      index.import(key, parsedData)
    })
  } else {
    initList.forEach((block) => {
      block.blockId = createIndexCompositeKey(block.id, block.blockId ?? block.id)

      index.add({ ...block, tag: [block.id, ...(block.tag ?? [])] })
    })
  }

  mog('CreateSearchIndex', { options, initList })
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
