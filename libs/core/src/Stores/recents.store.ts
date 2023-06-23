import { MAX_RECENT_SIZE } from '../Types'
import { StoreIdentifier } from '../Types/Store'
import { NODE_ID_PREFIX, SNIPPET_PREFIX } from '../Utils'
import { remove } from '../Utils/lodashUtils'
import { createStore } from '../Utils/storeCreator'

import { Link } from './link.store'

export interface LastOpenedType {
  notes: string[]
  snippet: string[]
  highlight: Link[]
}

export type RecentsType = {
  lastOpened: LastOpenedType
  recentResearchNodes: string[]
  setRecentResearchNodes: (nodes: Array<string>) => void
  addRecent: (nodeid?: string, link?: Link) => void
  updateRecent: (lastOpened: LastOpenedType) => void
  update: (lastOpened: string[]) => void
  clear: () => void
  clearResearchNodes: () => void
  addInResearchNodes: (nodeid: string) => void
  initRecents: (recentList: Array<string>) => void
  initializationTime: number
  setInitializationTime: (time: number) => void
}

const recentsStoreConfig = (set, get): RecentsType => ({
  lastOpened: {
    notes: [],
    snippet: [],
    highlight: []
  },

  initializationTime: Date.parse(new Date().toISOString()),
  setInitializationTime: (time: number) => {
    set({ initializationTime: time })
  },

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
    set({
      lastOpened: {
        notes: [],
        snippet: [],
        highlight: []
      }
    })
    set({ initializationTime: Date.parse(new Date().toISOString()) })
  },
  addRecent: (nodeid?: string, link?: Link) => {
    const oldLastOpened = get().lastOpened
    const { notes, snippet, highlight } = oldLastOpened

    const oldNotes = Array.from(new Set(notes))
    const oldSnippet = Array.from(new Set(snippet))
    const oldHighlight = Array.from(new Set(highlight))

    if (nodeid && nodeid.startsWith(NODE_ID_PREFIX)) {
      if (oldNotes.includes(nodeid)) {
        remove(oldNotes, (item) => item === nodeid)
      }
      set({
        lastOpened: {
          notes: [...oldNotes.slice(-MAX_RECENT_SIZE + 1), nodeid],
          snippet: oldSnippet,
          highlight: oldHighlight
        }
      })
    }

    if (nodeid && nodeid.startsWith(SNIPPET_PREFIX)) {
      if (oldSnippet.includes(nodeid)) {
        remove(oldSnippet, (item) => item === nodeid)
      }
      set({
        lastOpened: {
          notes: oldNotes,
          snippet: [...oldSnippet.slice(-MAX_RECENT_SIZE + 1), nodeid],
          highlight: oldHighlight
        }
      })
      console.log(get().lastOpened)
    }

    if (link) {
      if (highlight.length !== 0 && highlight[0]?.updatedAt > link.updatedAt) return

      const updatedHighlight = oldHighlight.filter((h: Link) => h.url !== link.url)
      updatedHighlight.unshift(link)
      updatedHighlight.splice(MAX_RECENT_SIZE)
      set({
        lastOpened: {
          notes: oldNotes,
          snippet: oldSnippet,
          highlight: updatedHighlight
        }
      })
    }

    // const setLastOpened = useUserPreferenceStore.getState().setLastOpened
    // setLastOpened(get().lastOpened)
  },

  updateRecent: (lastOpened: LastOpenedType) => {
    set({ lastOpened: lastOpened })
  },

  update: (lastOpened: string[]) =>
    set({
      lastOpened
    }),
  initRecents: (recentList) => set({ lastOpened: recentList })
})

export const useRecentsStore = createStore(recentsStoreConfig, StoreIdentifier.RECENTS, true)
