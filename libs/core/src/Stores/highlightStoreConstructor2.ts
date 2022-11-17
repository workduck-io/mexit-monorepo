import { GetState, SetState, StateCreator, StoreApi } from 'zustand'
import { Contents, ILink, NodeEditorContent, SharedNode } from '../Types/Editor'
import { ElementHighlightMetadata, HighlightBlockMap, Highlights } from '../Types/Highlight'
import { mog } from '../Utils/mog'

interface HighlightStore {
  highlights: Highlights
  highlightBlockMap: HighlightBlockMap

  initHighlightBlockMap: (ilinks: (ILink | SharedNode)[], contents: Contents) => void

  setHighlights: (highlights: Highlights) => void
  setHighlightBlockMap: (highlightBlockMap: HighlightBlockMap) => void

  addHighlightedBlock: (nodeId: string, content: NodeEditorContent) => void

  clearHighlightedBlock: (url: string, blockId: string) => void

  removeHighlight: (highlightId: string) => void

  clearAllHighlightedBlocks: () => void
}

interface AddHighlightToMap {
  highlightId: string
  nodeId: string
  blockId: string
}

/**
 * Helper function that adds a { highlight, note, block } to the highlightBlockMap in place
 */
const addToHighlightBlockMap = (hMap: HighlightBlockMap, { highlightId, nodeId, blockId }: AddHighlightToMap): void => {
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
          // if (!highlightBlockMap[elementMetadata.highlightId]) {
          //   highlightBlockMap[elementMetadata.highlightId] = {}
          //   if (!highlightBlockMap[elementMetadata.highlightId][ilink.nodeid]) {
          //     highlightBlockMap[elementMetadata.highlightId][ilink.nodeid] = [block.id]
          //   } else {
          //     highlightBlockMap[elementMetadata.highlightId][ilink.nodeid].push(block.id)
          //   }
          // } else {
          //   if (!highlightBlockMap[elementMetadata.highlightId][ilink.nodeid]) {
          //     highlightBlockMap[elementMetadata.highlightId][ilink.nodeid] = [block.id]
          //   } else {
          //     highlightBlockMap[elementMetadata.highlightId][ilink.nodeid].push(block.id)
          //   }
          // }

          // highlighted[elementMetadata.sourceUrl] = {
          //   ...highlighted[elementMetadata.sourceUrl],
          //   [block.id]: {
          //     elementMetadata,
          //     nodeId: this.nodeid,
          //     shared: !!this?.owner
          //   }
          // }
        }
      }, ilink)
    })

    // mog('initing highlights', { highlighted })
    set({ highlightBlockMap })
  },
  setHighlights: (highlights: Highlights) => {
    set({ highlights })
  },

  addHighlightedBlock: (nodeId, content) => {
    const { highlights } = get()
    const newHighlighted: Highlights = [...highlights]

    content.forEach((item) => {
      if (item?.metadata?.elementMetadata) {
        newHighlighted[item.metadata.elementMetadata.sourceUrl] = {
          ...newHighlighted[item.metadata.elementMetadata.sourceUrl],
          [item.id]: {
            elementMetadata: item.metadata.elementMetadata,
            nodeId
          }
        }
      }
    })
    mog('addHighlighted', { newHighlighted })
    set({ highlights: newHighlighted })
  },

  clearHighlightedBlock: (url, blockId) => {
    const oldHighlights = get().highlights

    if (oldHighlights[url][blockId]) {
      delete oldHighlights[url][blockId]
      set({ highlights: oldHighlights })
    }
  },

  removeHighlight: (highlightId) => {
    const { highlights, highlightBlockMap } = get()
    const newHighlights = [...highlights.filter((h) => h.entityId !== highlightId)]
    const newHighlightBlockMap = { ...highlightBlockMap }
    delete newHighlightBlockMap[highlightId]
    set({ highlights: newHighlights, highlightBlockMap: newHighlightBlockMap })
  },

  clearAllHighlightedBlocks: () => {
    const { highlights: oldHighlighted, highlightBlockMap: oldHighlightBlockMap } = get()
    mog('clearAllHighlighted', { oldHighlighted, oldHighlightBlockMap })
    set({ highlights: [], highlightBlockMap: {} })
  }
})
