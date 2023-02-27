import { StoreIdentifier } from '../Types/Store';
import { createStore } from '../Utils/storeCreator'

import { mog } from './blockHighlight.store';


/**
 * Used to store the state related to the highlighted blocks in the editor
 * NOTE: This is not affiliated with highlights captured from web
 */
export const blockHighlightStoreConfig = (set, get) => ({
  hightlighted: {
    preview: [],
    editor: []
  },
  addHighlightedBlockId: (id, key) => {
    const { hightlighted } = get()
    const newHighlighted = { ...hightlighted }
    newHighlighted[key].push(id)
    // mog('addHighlighted', { newHighlighted, id, key })
    set({ hightlighted: newHighlighted })
  },
  setHighlightedBlockIds: (ids, key) => {
    const { hightlighted } = get()
    const newHighlighted = { ...hightlighted }
    newHighlighted[key] = ids
    // mog('setHighlighted', { newHighlighted, ids, key })
    set({ hightlighted: newHighlighted })
  },
  clearHighlightedBlockIds: () => {
    const oldHighlighted = get().hightlighted
    const newHighlighted = {
      preview: [],
      editor: []
    }
    mog('clearHighlighted', { oldHighlighted })
    set({ hightlighted: newHighlighted })
  },
  clearAllHighlightedBlockIds: () => {
    const oldHighlighted = get().hightlighted
    const newHighlighted = {
      preview: [],
      editor: []
    }
    mog('clearAllHighlighted', { oldHighlighted })
    set({ hightlighted: newHighlighted })
  },
  isBlockHighlighted: (id) => {
    const { hightlighted } = get()
    // mog('isBlockHighlighted', { hightlighted, id })
    return hightlighted.editor.includes(id) || hightlighted.preview.includes(id)
  }
})

export const useBlockHighlightStore = createStore(blockHighlightStoreConfig, StoreIdentifier.BLOCKHIGHLIGHT , false)