import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const initStoreConfig = (set, get) => ({
  iframeAdded: false,
  setIframeAdded: (value: boolean) => {
    set((state) => ({ ...state, iframeAdded: value }))
  }
})

export const useInitStore = createStore(initStoreConfig, StoreIdentifier.INIT , false)
