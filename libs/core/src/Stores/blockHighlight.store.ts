import { StoreIdentifier } from '../Types/Store';
import { mog } from '../Utils/mog';
import { createStore } from '../Utils/storeCreator'


/**
 * Used to store the state related to the highlighted blocks in the editor
 * NOTE: This is not affiliated with highlights captured from web
 */
export const blockHighlightStoreConfig = (set, get) => ({
  highlighted: {
    preview: [],
    editor: []
  },
  addHighlightedBlockId: (id, key) => {
    const { highlighted } = get()
    const newHighlighted = { ...highlighted }
    newHighlighted[key].push(id)
    // mog('addHighlighted', { newHighlighted, id, key })
    set({ highlighted: newHighlighted })
  },
  setHighlightedBlockIds: (ids, key) => {
    const { highlighted } = get()
    const newHighlighted = { ...highlighted }
    newHighlighted[key] = ids
    // mog('setHighlighted', { newHighlighted, ids, key })
    set({ highlighted: newHighlighted })
  },
  clearHighlightedBlockIds: () => {
    const oldHighlighted = get().highlighted
    const newHighlighted = {
      preview: [],
      editor: []
    }
    mog('clearHighlighted', { oldHighlighted })
    set({ highlighted: newHighlighted })
  },
  clearAllHighlightedBlockIds: () => {
    const oldHighlighted = get().highlighted
    const newHighlighted = {
      preview: [],
      editor: []
    }
    mog('clearAllHighlighted', { oldHighlighted })
    set({ highlighted: newHighlighted })
  },
  isBlockHighlighted: (id) => {
    const { highlighted } = get()
    // mog('isBlockHighlighted', { hightlighted, id })
    return highlighted.editor.includes(id) || highlighted.preview.includes(id)
  }
})

export const useBlockHighlightStore = createStore(blockHighlightStoreConfig, StoreIdentifier.BLOCKHIGHLIGHT , false)