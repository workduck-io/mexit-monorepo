import { captureConfigs } from '../Data/smartcapture'
import { SmartCaptureConfig } from '../Types/SmartCapture'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

const initSmartCaptureStore = () => {
  return {
    config: captureConfigs as SmartCaptureConfig[], // [] as SmartCaptureConfig[],
    smartCaptureCache: {} as Record<string, string> // key is the emailId, value is the NoteId
  }
}

const smartCaptureStoreConfig = (set, get) => ({
  ...initSmartCaptureStore(),
  setSmartCaptureList: (config: SmartCaptureConfig[]) => {
    // !TODO: REVERT THIS
    // set({
    //   config
    // })
  },
  getById: (configId: string) => {
    return get().config.find((c) => c.entityId === configId)
  },
  getMatchingURLConfig: (url: string) => {
    return get().config.find((c) => {
      return url.match(c.regex)
    })
  },
  addInSmartCaptureCache: (emailId: string, noteId: string) => {
    const cache = get().smartCaptureCache

    set({
      smartCaptureCache: {
        ...cache,
        [emailId]: noteId
      }
    })
  },
  removeFromCache: (noteId: string) => {
    const cache = get().smartCaptureCache
    Object.entries(cache).forEach(([key, value]) => {
      if (value === noteId) {
        delete cache[key]
      }
    })

    set({
      smartCaptureCache: {
        ...cache
      }
    })
  },
  clear: () => {
    const initailState = initSmartCaptureStore()

    set(initailState)
  }
})

export const useSmartCaptureStore = createStore(smartCaptureStoreConfig, StoreIdentifier.SMARTCAPTURE, true)
