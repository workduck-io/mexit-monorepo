import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

/**
 * Used to store the state related to the highlighted blocks in the editor
 * NOTE: This is not affiliated with highlights captured from web
 */

const getInitialStoreState = () => ({
  highlighted: {
    preview: [] as string[],
    editor: [] as string[]
  }
})

export const blockHighlightStoreConfig = (set, get) => ({
  ...getInitialStoreState(),
  addHighlightedBlockId: (id: string, key: string) => {
    const { highlighted } = get()
    const newHighlighted = { ...highlighted }
    newHighlighted[key].push(id)
    // mog('addHighlighted', { newHighlighted, id, key })
    set({ highlighted: newHighlighted })
  },
  setHighlightedBlockIds: (ids: string[], key: string) => {
    const { highlighted } = get()
    const newHighlighted = { ...highlighted }
    newHighlighted[key] = ids
    // mog('setHighlighted', { newHighlighted, ids, key })
    set({ highlighted: newHighlighted })
  },
  clearHighlightedBlockIds: () => {
    const initialState = getInitialStoreState()
    set({
      highlighted: initialState.highlighted
    })
  },
  clearAllHighlightedBlockIds: () => {
    const initialState = getInitialStoreState()
    set({
      highlighted: initialState.highlighted
    })
  },
  isBlockHighlighted: (id: string) => {
    const highlighted = get().highlighted
    return highlighted?.editor?.includes(id) || highlighted?.preview?.includes(id)
  }
})

export const useBlockHighlightStore = createStore(blockHighlightStoreConfig, StoreIdentifier.BLOCKHIGHLIGHT, false)
