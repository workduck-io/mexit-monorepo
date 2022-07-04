import create from 'zustand'
import { ElementHighlightMetadata, mog, NodeContent, NodeEditorContent } from '@mexit/core'
import { persist } from 'zustand/middleware'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

interface Highlighted {
  [sourceURL: string]: {
    [blockId: string]: {
      elementMetadata: ElementHighlightMetadata
      nodeId: string
    }
  }
}
interface HighlightStore {
  /*
   * The current ids for specific editors to highlight
   */
  highlighted: Highlighted
  addHighlightedBlock: (nodeId: string, content: NodeEditorContent) => void
  // setHighlightedBlockIds: () => void
  clearHighlightedBlock: (url: string, blockId: string) => void
  clearAllHighlightedBlocks: () => void
}

export const useHighlightStore = create<HighlightStore>(
  persist(
    (set, get) => ({
      highlighted: {},
      addHighlightedBlock: (nodeId, content) => {
        const { highlighted } = get()
        const newHighlighted = { ...highlighted }

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
        set({ highlighted: newHighlighted })
      },
      clearHighlightedBlock: (url, blockId) => {
        const oldHighlighted = get().highlighted
        delete oldHighlighted[url][blockId]
        set({ highlighted: oldHighlighted })
      },
      clearAllHighlightedBlocks: () => {
        const oldHighlighted = get().highlighted
        const newHighlighted = {}
        mog('clearAllHighlighted', { oldHighlighted })
        set({ highlighted: newHighlighted })
      }
    }),
    {
      name: 'highlights-store',
      getStorage: () => asyncLocalStorage
    }
  )
)
