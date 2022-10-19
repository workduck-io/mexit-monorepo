import { ILink, SharedNode, Contents, NodeEditorContent } from '../Types/Editor'
import { mog } from '../Utils/mog'
import { ElementHighlightMetadata } from '../Utils/serializer'

export interface SingleHighlight {
  elementMetadata: ElementHighlightMetadata
  nodeId: string
  shared?: boolean
}

export interface SourceHighlights {
  [blockId: string]: SingleHighlight
}

export interface Highlighted {
  [sourceURL: string]: SourceHighlights
}

export interface HighlightStore {
  /*
   * The current ids for specific editors to highlight
   */
  highlighted: Highlighted
  initHighlights: (ilinks: (ILink | SharedNode)[], contents: Contents) => void
  setHighlights: (highlights: Highlighted) => void
  addHighlightedBlock: (nodeId: string, content: NodeEditorContent) => void
  clearHighlightedBlock: (url: string, blockId: string) => void
  clearAllHighlightedBlocks: () => void
}
export const highlightStoreConstructor = (set, get) => ({
  highlighted: {},
  initHighlights: (ilinks, contents) => {
    const highlighted = {}

    ilinks.forEach((ilink) => {
      contents[ilink.nodeid]?.content?.forEach(function (block) {
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

    mog('initing highlights', { highlighted })
    set({ highlighted: highlighted })
  },
  setHighlights: (highlights) => {
    set({ highlighted: highlights })
  },
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

    if (oldHighlighted[url][blockId]) {
      delete oldHighlighted[url][blockId]
      set({ highlighted: oldHighlighted })
    }
  },
  clearAllHighlightedBlocks: () => {
    const oldHighlighted = get().highlighted
    const newHighlighted = {}
    mog('clearAllHighlighted', { oldHighlighted })
    set({ highlighted: newHighlighted })
  }
})
