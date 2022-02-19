export interface Tab {
  id?: number
  windowId?: number
  title?: string
  url?: string
  status?: string
  incognito?: boolean
  pinned?: boolean
}

export interface TabGroup {
  id: string
  name: string
  tabs: Tab[]
  windowId: number
}
