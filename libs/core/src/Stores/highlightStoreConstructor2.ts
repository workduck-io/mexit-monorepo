import { GetState, SetState, StateCreator, StoreApi } from 'zustand'
import { Contents, ILink, NodeEditorContent, SharedNode } from '../Types/Editor'
import { ElementHighlightMetadata, Highlight, HighlightBlockMap, Highlights } from '../Types/Highlight'
import { mog } from '../Utils/mog'

interface AddHighlightBlockToMap {
  highlightId: string
  nodeId: string
  blockId: string
}

interface AddHighlightBlocksToMap {
  nodeId: string
  blockIds: string[]
}

interface HighlightStore {
  highlights: Highlights
  highlightBlockMap: HighlightBlockMap

  initHighlightBlockMap: (ilinks: (ILink | SharedNode)[], contents: Contents) => void

  setHighlights: (highlights: Highlights) => void
  setHighlightBlockMap: (highlightBlockMap: HighlightBlockMap) => void

  addHighlight: (highlight: Highlight, mapOptions: AddHighlightBlocksToMap) => void

  removeHighlight: (highlightId: string) => void

  clearAllHighlightedBlocks: () => void
}

/**
 * Helper function that adds a { highlight, note, block } to the highlightBlockMap in place
 */
const addToHighlightBlockMap = (
  hMap: HighlightBlockMap,
  { highlightId, nodeId, blockId }: AddHighlightBlockToMap
): void => {
  if (hMap[highlightId] === undefined) {
    hMap[highlightId] = {}
  }

  if (hMap[highlightId][nodeId] === undefined) {
    hMap[highlightId][nodeId] = []
  }

  if (hMap[highlightId][nodeId].includes(blockId)) {
    return
  } else {
    hMap[highlightId][nodeId].push(blockId)
  }
}

// LOOK Typed constructor
export const highlightStoreConstructor2: StateCreator<
  HighlightStore,
  SetState<HighlightStore>,
  GetState<HighlightStore>,
  StoreApi<HighlightStore>
> = (set, get) => ({
  highlights: [],
  highlightBlockMap: {},
  setHighlightBlockMap: (highlightBlockMap: HighlightBlockMap) => set({ highlightBlockMap }),

  initHighlightBlockMap: (ilinks, contents) => {
    const highlightBlockMap = {}

    ilinks?.forEach((ilink) => {
      contents[ilink.nodeid]?.content?.forEach(function (block) {
        const elementMetadata: ElementHighlightMetadata = block?.metadata?.elementMetadata
        if (elementMetadata?.highlightId && this) {
          addToHighlightBlockMap(highlightBlockMap, {
            highlightId: elementMetadata.highlightId,
            nodeId: ilink.nodeid,
            blockId: block.id
          })
        }
      }, ilink)
    })

    mog('initing highlights', { highlightBlockMap })
    set({ highlightBlockMap })
  },

  setHighlights: (highlights: Highlights) => {
    set({ highlights })
  },

  addHighlight: (highlight, { nodeId, blockIds }) => {
    const { highlights, highlightBlockMap } = get()
    const newHighlighted: Highlights = [...highlights, highlight]
    const newHighlightBlockMap = { ...highlightBlockMap }

    blockIds.forEach((blockId) => {
      addToHighlightBlockMap(newHighlightBlockMap, {
        highlightId: highlight.entityId,
        nodeId,
        blockId
      })
    })

    mog('addHighlighted', { newHighlighted, newHighlightBlockMap })
    set({ highlights: newHighlighted, highlightBlockMap: newHighlightBlockMap })
  },

  removeHighlight: (highlightId) => {
    const { highlights, highlightBlockMap } = get()
    const newHighlights = [...highlights.filter((h) => h.entityId !== highlightId)]
    const newHighlightBlockMap = { ...highlightBlockMap }
    delete newHighlightBlockMap[highlightId]
    mog('removeHighlighted', { newHighlights, newHighlightBlockMap })
    set({ highlights: newHighlights, highlightBlockMap: newHighlightBlockMap })
  },

  clearAllHighlightedBlocks: () => {
    const { highlights: oldHighlighted, highlightBlockMap: oldHighlightBlockMap } = get()
    mog('clearAllHighlighted', { oldHighlighted, oldHighlightBlockMap })
    set({ highlights: [], highlightBlockMap: {} })
  }
})
