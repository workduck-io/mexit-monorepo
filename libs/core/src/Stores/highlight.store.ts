import { produce } from 'immer'

import { ElementHighlightMetadata, Highlight, HighlightBlockMap, Highlights } from '../Types/Highlight'
import { StoreIdentifier } from '../Types/Store'
import { deleteQueryParams } from '../Utils'
import { mog } from '../Utils/mog'
import { createStore } from '../Utils/storeCreator'

interface AddHighlightBlockToMap {
  highlightId: string
  nodeId: string
  blockId: string
}

interface AddHighlightBlocksToMap {
  nodeId: string
  blockIds: string[]
}

export type AddHighlightFn = (highlight: Highlight, mapOptions?: AddHighlightBlocksToMap) => void
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
const highlightStoreConfig = (set, get) => ({
  highlights: [],
  highlightBlockMap: {},
  setHighlightBlockMap: (highlightBlockMap: HighlightBlockMap) => set({ highlightBlockMap }),
  addHighlightEntity: (highlight: Highlight) => {
    const newHighlight = { ...highlight, createdAt: Date.now() }
    const existingHighlights = get().highlights
    set({ highlights: [newHighlight, ...existingHighlights] })
  },

  initHighlightBlockMap: (ilinks, contents) => {
    const highlightBlockMap = {}

    ilinks?.forEach((ilink) => {
      contents[ilink.nodeid]?.content?.forEach(function (block) {
        const elementMetadata: ElementHighlightMetadata = block?.metadata?.elementMetadata
        if (elementMetadata?.type === 'highlightV1' && elementMetadata?.id && this) {
          addToHighlightBlockMap(highlightBlockMap, {
            highlightId: elementMetadata.id,
            nodeId: ilink.nodeid,
            blockId: block.id
          })
        }
      }, ilink)
    })

    mog('initing highlights', { highlightBlockMap })
    set({ highlightBlockMap })
  },

  reset: () => {
    set({ highlights: [], highlightBlockMap: {} })
  },

  setHighlights: (highlights: Highlights) => {
    set({ highlights })
  },

  updateHighlightBlockMap: (entityId: string, { nodeId, blockIds }) => {
    set(
      produce((draft: any) => {
        blockIds.forEach((blockId: string) => {
          addToHighlightBlockMap(draft.highlightBlockMap, {
            highlightId: entityId,
            nodeId,
            blockId
          })
        })
      })
    )
  },

  addHighlight: (highlight, { nodeId, blockIds }) => {
    set(
      produce((draft: any) => {
        draft.highlights?.unshift(highlight)

        blockIds.forEach((blockId: string) => {
          addToHighlightBlockMap(draft.highlightBlockMap, {
            highlightId: highlight.entityId,
            nodeId,
            blockId
          })
        })
      })
    )
  },

  removeHighlight: (highlightId: string) => {
    const { highlights, highlightBlockMap } = get()
    const newHighlights = [...highlights.filter((h) => h.entityId !== highlightId)]
    const newHighlightBlockMap = { ...highlightBlockMap }
    delete newHighlightBlockMap[highlightId]
    mog('removeHighlighted', { newHighlights, newHighlightBlockMap })
    set({ highlights: newHighlights, highlightBlockMap: newHighlightBlockMap })
  },

  getHighlightsOfUrl: (url: string) => {
    const withoutScrollUrl = deleteQueryParams(url)

    const highlights = get().highlights ?? []

    return highlights.filter((h) => h?.properties?.sourceUrl === withoutScrollUrl)
  },

  clearAllHighlightedBlocks: () => {
    set({ highlights: [], highlightBlockMap: {} })
  }
})

export const useHighlightStore = createStore(highlightStoreConfig, StoreIdentifier.HIGHLIGHTS, true)
