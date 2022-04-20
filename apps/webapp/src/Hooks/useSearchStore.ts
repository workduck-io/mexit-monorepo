import create from 'zustand'

import { GenericSearchData, GenericSearchResult, ILink, mog, SearchIndex } from '@mexit/core'

import { createSearchIndex } from '../Utils/flexsearch'
import { diskIndex, indexNames } from './../Data/constants'

// interface BlockMapData {
//   text: string
//   nodeUID: string
// }

// interface SearchStoreState {
//   blocks: Map<string, BlockMapData>
//   nodeBlockRevIndex: Map<string, Set<string>>
//   index: Document<BlockIndexData> | null
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   initializeSearchIndex: (initList: BlockIndexData[]) => Document<BlockIndexData>
//   addBlock: (block: BlockIndexData) => void
//   addMultipleBlocks: (blocks: BlockIndexData[]) => void
//   addNode: (node: Node) => void
//   removeBlock: (blockUID: string) => void
//   removeNode: (nodeUID: string) => void
//   updateBlock: (newBlock: Block) => void
//   updateNode: (newNode: Node) => void
//   fetchBlockByID: (blockUID: string) => BlockIndexData
//   searchIndex: (query: string) => FlexSearchResult[]
//   //   fetchIndexLocalStorage: () => void
// }

// const useSearchStore = create<SearchStoreState>(
//   persist(
//     (set, get) => ({
//       blocks: new Map<string, BlockMapData>(),
//       nodeBlockRevIndex: new Map<string, Set<string>>(),
//       index: null,
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       initializeSearchIndex: (initList: BlockIndexData[]) => {
//         const index = createFlexsearchIndex(initList)
//         set({ index })
//         initList.forEach((block) => {
//           get().blocks.set(block.blockUID, { text: block.text, nodeUID: block.nodeUID })
//           if (block.nodeUID in get().nodeBlockRevIndex) {
//             const updated = get().nodeBlockRevIndex.get(block.nodeUID).add(block.blockUID)
//             get().nodeBlockRevIndex.set(block.nodeUID, updated)
//           } else {
//             const val = new Set<string>([block.blockUID])
//             get().nodeBlockRevIndex.set(block.nodeUID, val)
//           }
//         })
//         return index
//       },
//       addBlock: (block: BlockIndexData) => {
//         get().blocks.set(block.blockUID, { text: block.text, nodeUID: block.nodeUID })
//         get().index.add(block)

//         if (block.nodeUID in get().nodeBlockRevIndex) {
//           const updated = get().nodeBlockRevIndex.get(block.nodeUID).add(block.blockUID)
//           get().nodeBlockRevIndex.set(block.nodeUID, updated)
//         } else {
//           const val = new Set<string>([block.blockUID])
//           get().nodeBlockRevIndex.set(block.nodeUID, val)
//         }
//       },
//       addMultipleBlocks: (blocks: BlockIndexData[]) => {
//         blocks.forEach((block) => get().addBlock(block))
//       },
//       addNode: (node: Node) => {
//         const blocks = parseNode(node)
//         blocks.forEach((block) => get().addBlock(block))
//       },
//       removeBlock: (blockUID: string) => {
//         const blockData = get().blocks.get(blockUID)
//         get().index.remove(blockUID)
//         get().blocks.delete(blockUID)

//         const nodeUID = blockData.nodeUID
//         const updated = get().nodeBlockRevIndex.get(nodeUID)
//         updated.delete(blockUID)
//         get().nodeBlockRevIndex.set(nodeUID, updated)
//       },
//       removeNode: (nodeUID: string) => {
//         const blocks = get().nodeBlockRevIndex.get(nodeUID)
//         blocks.forEach((block) => get().removeBlock(block))
//       },
//       updateBlock: (newBlock: Block) => {
//         const blockText = parseBlock(newBlock.children)
//         get().blocks.set(newBlock.id, { text: blockText, nodeUID: newBlock.nodeUID })
//         get().index.update({
//           blockUID: newBlock.id,
//           nodeUID: newBlock.nodeUID,
//           text: blockText
//         })
//       },
//       updateNode: (newNode: Node) => {
//         get().removeNode(newNode.id)
//         get().addNode(newNode)
//       },
//       fetchBlockByID: (blockUID: string) => {
//         const blockData = get().blocks.get(blockUID)
//         return {
//           blockUID: blockUID,
//           nodeUID: blockData.nodeUID,
//           text: blockData.text
//         }
//       },
//       searchIndex: (query: string) => {
//         const response = get().index.search(query)
//         const results = new Array<any>()
//         response.forEach((entry) => {
//           const matchField = entry.field
//           entry.result.forEach((i) => {
//             const t: FlexSearchResult = {
//               ...get().fetchBlockByID(i),
//               matchField
//             }
//             results.push(t)
//           })
//         })

//         return results
//       }
//     }),
//     { name: 'mexit-search-index' }
//   )
// )

interface SearchStoreState {
  // docs: Map<string, NodeTitleText>
  index: SearchIndex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (ilinks: ILink[], initData: Record<indexNames, any[]>) => SearchIndex
  addDoc: (idxName: keyof SearchIndex, doc: GenericSearchData) => void
  removeDoc: (idxName: keyof SearchIndex, id: string) => void
  updateDoc: (idxName: keyof SearchIndex, newDoc: GenericSearchData) => void
  searchIndex: (idxName: keyof SearchIndex, query: string) => GenericSearchResult[]
}
export const useSearchStore = create<SearchStoreState>((set, get) => ({
  index: diskIndex,
  initializeSearchIndex: (ilinks, initData) => {
    const index = createSearchIndex(ilinks, initData)
    set({ index })
    return index
  },
  addDoc: (idxName, newDoc) => {
    if (get().index[idxName]) {
      const idx = get().index[idxName].add(newDoc)
      set({ index: { ...get().index, [idxName]: idx } })
    }
  },
  removeDoc: (idxName, id) => {
    const idx = get().index[idxName].remove(id)
    set({ index: { ...get().index, [idxName]: idx } })
  },
  updateDoc: (idxName, newDoc) => {
    const idx = get().index[idxName].update(newDoc)
    set({ index: { ...get().index, [idxName]: idx } })
  },
  searchIndex: (idxName, query) => {
    try {
      const response = get().index[idxName].search(query)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const results = new Array<any>()
      response.forEach((entry) => {
        const matchField = entry.field
        entry.result.forEach((i) => {
          mog('ResultEntry', { i })
          results.push({ id: i, matchField })
        })
      })

      const combinedResults = new Array<GenericSearchResult>()
      results.forEach(function (item) {
        const existing = combinedResults.filter(function (v, i) {
          return v.id === item.id
        })
        if (existing.length) {
          const existingIndex = combinedResults.indexOf(existing[0])
          combinedResults[existingIndex].matchField = combinedResults[existingIndex].matchField.concat(item.matchField)
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
    return []
  }
}))
export default useSearchStore
