import { MAX_RECENT_SIZE } from '../Types'
import { StoreIdentifier } from '../Types/Store'
import { Settify } from '../Utils'
import { remove } from '../Utils/lodashUtils'
import { createStore } from '../Utils/storeCreator'

export type LastOpenedType = Record<keyof typeof RecentType, string[]>

export enum RecentType {
  notes = 'notes',
  snippet = 'snippet',
  highlight = 'highlight'
}

export type RecentsType = {
  lastOpened: LastOpenedType
  recentResearchNodes: string[]
  setRecentResearchNodes: (nodes: Array<string>) => void
  addRecent: (key: RecentType, value: string) => void
  update: (lastOpened: LastOpenedType) => void
  clear: () => void
  clearResearchNodes: () => void
  addInResearchNodes: (nodeid: string) => void
  initRecents: (recentList: Array<string>) => void
}

const getRecentsInitState = () => ({
  lastOpened: {
    notes: [],
    snippet: [],
    highlight: []
  },
  recentResearchNodes: []
})

const recentsStoreConfig = (set, get): RecentsType => ({
  ...getRecentsInitState(),
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
    const initState = getRecentsInitState()
    set(initState)
  },
  addRecent: (key, value) => {
    const oldLastOpened = get().lastOpened

    const { notes, snippet, highlight } = oldLastOpened

    const oldNotes = Settify(notes)
    const oldSnippet = Settify(snippet)
    const oldHighlight = Settify(highlight)
    let updatedHighlight = []

    switch (key) {
      case RecentType.notes:
        if (oldNotes.includes(value)) {
          remove(oldNotes, (item) => item === value)
        }
        set({
          lastOpened: {
            notes: [...oldNotes.slice(-MAX_RECENT_SIZE + 1), value],
            snippet: oldSnippet,
            highlight: oldHighlight
          }
        })
        break

      case RecentType.snippet:
        if (oldSnippet.includes(value)) {
          remove(oldSnippet, (item) => item === value)
        }
        set({
          lastOpened: {
            notes: oldNotes,
            snippet: [...oldSnippet.slice(-MAX_RECENT_SIZE + 1), value],
            highlight: oldHighlight
          }
        })
        break

      case RecentType.highlight:
        updatedHighlight = oldHighlight.filter((item) => item !== value)

        set({
          lastOpened: {
            notes: oldNotes,
            snippet: oldSnippet,
            highlight: [value, ...updatedHighlight].slice(0, MAX_RECENT_SIZE)
          }
        })
        break

      default:
        break
    }
  },

  update: (lastOpened: LastOpenedType) => {
    if (!lastOpened) {
      set({ lastOpened: getRecentsInitState().lastOpened })
    } else {
      set({ lastOpened: lastOpened })
    }
  },
  initRecents: (recentList) => set({ lastOpened: recentList })
})

export const useRecentsStore = createStore(recentsStoreConfig, StoreIdentifier.RECENTS, true)
