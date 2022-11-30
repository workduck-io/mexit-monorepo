export type SmartCaptureStore = {
  config: any[]
  setSmartConfigList: (nodes: Array<string>) => void
  clear: () => void
  getById: (configId: string) => any[]
  getRegexList: () => any[]
  initSmartConfigList: (recentList: Array<string>) => void
}

export const smartCaptureStoreConstructor = (set, get) => ({
  config: [],
  setSmartConfigList: (config: Array<any>) => {
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
  initSmartConfigList: (recentList) => set({ config: recentList })
})
