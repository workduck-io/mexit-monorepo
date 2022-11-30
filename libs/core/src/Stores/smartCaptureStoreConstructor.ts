export type SmartCaptureStore = {
  config: any[]
  setSmartCaptureList: (nodes: Array<string>) => void
  clear: () => void
  getById: (configId: string) => any[]
  getRegexList: () => any[]
  initSmartCaptureList: (recentList: Array<string>) => void
}

export const smartCaptureStoreConstructor = (set, get) => ({
  config: [],
  setSmartCaptureList: (config: Array<any>) => {
    set({ config })
  },
  getById: (configId: string) => {
    return get().config.find((c) => c.entityId === configId)
  },
  getRegexList: () => {
    return get().config.map((c) => ({
      regex: c.regex,
      WebPage: c.base
    }))
  },
  clear: () => {
    set({ config: [] })
  },
  initSmartCaptureList: (recentList) => set({ config: recentList })
})
