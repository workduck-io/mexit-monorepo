import create from 'zustand'
import { Contents, ElementHighlightMetadata, ILink, mog, NodeContent, NodeEditorContent, SharedNode } from '@mexit/core'
import { persist } from 'zustand/middleware'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

interface Highlighted {
  [sourceURL: string]: {
    [blockId: string]: {
      elementMetadata: ElementHighlightMetadata
      nodeId: string
      shared?: boolean
    }
  }
}
interface HighlightStore {
  /*
   * The current ids for specific editors to highlight
   */
  highlighted: Highlighted
  initHighlights: (ilinks: (ILink | SharedNode)[], contents: Contents) => void
  addHighlightedBlock: (nodeId: string, content: NodeEditorContent, url: string) => void
  clearHighlightedBlock: (url: string, blockId: string) => void
  clearAllHighlightedBlocks: () => void
}

export const useHighlightStore = create<HighlightStore>(
  persist(
    (set, get) => ({
      highlighted: {},
      initHighlights: (ilinks, contents) => {
        const highlighted = {}

        ilinks.forEach((ilink) => {
          contents[ilink.nodeid]?.content.forEach(function (block) {
            if (block?.metadata?.elementMetadata && this) {
              highlighted[block.metadata.elementMetadata.sourceUrl] = {
                ...highlighted[block.metadata.elementMetadata.sourceUrl],
                [block.id]: {
                  elementMetadata: block.metadata.elementMetadata,
                  nodeId: this.nodeid,
                  shared: !!this?.owner
                }
              }
            }
          }, ilink)
        })

        // mog('initing highlights', { highlighted })
        set({ highlighted: highlighted })
      },
      addHighlightedBlock: (nodeId, content, url) => {
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
