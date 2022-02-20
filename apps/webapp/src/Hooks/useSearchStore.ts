import create from 'zustand'
import { persist } from 'zustand/middleware'

import { BlockIndexData, Node, Block, FlexSearchResult } from '../Types/Data'
import { Document } from 'flexsearch'
import { createFlexsearchIndex, parseNode, parseBlock } from '../Utils/flexsearch'

interface BlockMapData {
  text: string
  nodeUID: string
}

interface SearchStoreState {
  blocks: Map<string, BlockMapData>
  nodeBlockRevIndex: Map<string, Set<string>>
  index: Document | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: BlockIndexData[]) => Document
  addBlock: (block: BlockIndexData) => void
  addMultipleBlocks: (blocks: BlockIndexData[]) => void
  addNode: (node: Node) => void
  removeBlock: (blockUID: string) => void
  removeNode: (nodeUID: string) => void
  updateBlock: (newBlock: Block) => void
  updateNode: (newNode: Node) => void
  fetchBlockByID: (blockUID: string) => BlockIndexData
  searchIndex: (query: string) => FlexSearchResult[]
  //   fetchIndexLocalStorage: () => void
}

const useSearchStore = create<SearchStoreState>(
  persist(
    (set, get) => ({
      blocks: new Map<string, BlockMapData>(),
      nodeBlockRevIndex: new Map<string, Set<string>>(),
      index: null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initializeSearchIndex: (initList: BlockIndexData[]) => {
        const index = createFlexsearchIndex(initList)
        set({ index })
        initList.forEach((block) => {
          get().blocks.set(block.blockUID, { text: block.text, nodeUID: block.nodeUID })
          if (block.nodeUID in get().nodeBlockRevIndex) {
            const updated = get().nodeBlockRevIndex.get(block.nodeUID).add(block.blockUID)
            get().nodeBlockRevIndex.set(block.nodeUID, updated)
          } else {
            const val = new Set<string>([block.blockUID])
            get().nodeBlockRevIndex.set(block.nodeUID, val)
          }
        })
        return index
      },
      addBlock: (block: BlockIndexData) => {
        get().blocks.set(block.blockUID, { text: block.text, nodeUID: block.nodeUID })
        get().index.add(block)

        if (block.nodeUID in get().nodeBlockRevIndex) {
          const updated = get().nodeBlockRevIndex.get(block.nodeUID).add(block.blockUID)
          get().nodeBlockRevIndex.set(block.nodeUID, updated)
        } else {
          const val = new Set<string>([block.blockUID])
          get().nodeBlockRevIndex.set(block.nodeUID, val)
        }
      },
      addMultipleBlocks: (blocks: BlockIndexData[]) => {
        blocks.forEach((block) => get().addBlock(block))
      },
      addNode: (node: Node) => {
        const blocks = parseNode(node)
        blocks.forEach((block) => get().addBlock(block))
      },
      removeBlock: (blockUID: string) => {
        const blockData = get().blocks.get(blockUID)
        get().index.remove(blockUID)
        get().blocks.delete(blockUID)

        const nodeUID = blockData.nodeUID
        const updated = get().nodeBlockRevIndex.get(nodeUID)
        updated.delete(blockUID)
        get().nodeBlockRevIndex.set(nodeUID, updated)
      },
      removeNode: (nodeUID: string) => {
        const blocks = get().nodeBlockRevIndex.get(nodeUID)
        blocks.forEach((block) => get().removeBlock(block))
      },
      updateBlock: (newBlock: Block) => {
        const blockText = parseBlock(newBlock.children)
        get().blocks.set(newBlock.id, { text: blockText, nodeUID: newBlock.nodeUID })
        get().index.update({
          blockUID: newBlock.id,
          nodeUID: newBlock.nodeUID,
          text: blockText
        })
      },
      updateNode: (newNode: Node) => {
        get().removeNode(newNode.id)
        get().addNode(newNode)
      },
      fetchBlockByID: (blockUID: string) => {
        const blockData = get().blocks.get(blockUID)
        return {
          blockUID: blockUID,
          nodeUID: blockData.nodeUID,
          text: blockData.text
        }
      },
      searchIndex: (query: string) => {
        const response = get().index.search(query)
        const results = new Array<any>()
        response.forEach((entry) => {
          const matchField = entry.field
          entry.result.forEach((i) => {
            const t: FlexSearchResult = {
              ...get().fetchBlockByID(i),
              matchField
            }
            results.push(t)
          })
        })

        return results
      }
    }),
    { name: 'mexit-search-index' }
  )
)

export default useSearchStore
