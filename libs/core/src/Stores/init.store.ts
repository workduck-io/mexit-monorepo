import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const initStoreConfig = (set, get) => ({
  iframeAdded: false,
  setIframeAdded: (iframeAdded: boolean) => {
    set({ iframeAdded })
  }
})

export const useInitStore = createStore(initStoreConfig, StoreIdentifier.INIT, false)
