import { StoreIdentifier } from '../Types/Store'
import { remove } from '../Utils/lodashUtils'
import { createStore } from '../Utils/storeCreator'

export const MAX_RECENT_SIZE = 10

export type RecentsType = {
  lastOpened: string[]
  recentResearchNodes: string[]
  setRecentResearchNodes: (nodes: Array<string>) => void
  addRecent: (nodeid: string) => void
  update: (lastOpened: string[]) => void
  clear: () => void
  clearResearchNodes: () => void
  addInResearchNodes: (nodeid: string) => void
  initRecents: (recentList: Array<string>) => void
}

export const recentsStoreConfig = (set, get): RecentsType => ({
  lastOpened: [],
  recentResearchNodes: [],
  setRecentResearchNodes: (nodes: Array<string>) => {
    set({ recentResearchNodes: nodes })
  },
  clearResearchNodes: () => {
    set({ recentResearchNodes: [] })
  },
  addInResearchNodes: (nodeid: string) => {
    const oldLast10 = Array.from(new Set(get().recentResearchNodes))
    if (oldLast10.includes(nodeid)) {
      remove(oldLast10, (item) => item === nodeid)
    }

    set({
      recentResearchNodes: [...oldLast10.slice(-MAX_RECENT_SIZE + 1), nodeid]
    })
  },
  clear: () => {
    set({ lastOpened: [] })
  },
  addRecent: (nodeid: string) => {
    const oldLast10 = Array.from(new Set(get().lastOpened))
    if (oldLast10.includes(nodeid)) {
      remove(oldLast10, (item) => item === nodeid)
    }

    set({
      lastOpened: [...oldLast10.slice(-MAX_RECENT_SIZE + 1), nodeid]
    })
  },
  update: (lastOpened: string[]) =>
    set({
      lastOpened
    }),
  initRecents: (recentList) => set({ lastOpened: recentList })
})

export const useRecentsStore = createStore(recentsStoreConfig, StoreIdentifier.RECENTS, true)
