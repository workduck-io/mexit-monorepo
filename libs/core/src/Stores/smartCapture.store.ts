import { SmartCaptureConfig } from '../Types/SmartCapture'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const smartCaptureStoreConfig = (set, get) => ({
  config: [],
  setSmartCaptureList: (config: SmartCaptureConfig[]) => {
    set({ config })
  },
  getById: (configId: string) => {
    return get().config.find((c) => c.entityId === configId)
  },
  getMatchingURLConfig: (url: string) => {
    return get().config.find((c) => url.match(c.regex))
  },
  clear: () => {
    set({ config: [] })
  }
})

export const useSmartCaptureStore = createStore(smartCaptureStoreConfig, StoreIdentifier.SMARTCAPTURE, true)
