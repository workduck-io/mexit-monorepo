import { SmartCaptureConfig } from '../Types/SmartCapture'

export const smartCaptureStoreConstructor = (set, get) => ({
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
