import { remove } from 'lodash'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export type RecentsType = {
  lastOpened: string[]
  addRecent: (nodeid: string) => void
  update: (lastOpened: string[]) => void
  clear: () => void
  initRecents: (recentList: Array<string>) => void
}

export const useRecentsStore = create<RecentsType>(
  persist(
    (set, get) => ({
      lastOpened: [],
      clear: () => {
        set({ lastOpened: [] })
      },
      addRecent: (nodeid: string) => {
        const oldLast10 = Array.from(new Set(get().lastOpened))
        if (oldLast10.includes(nodeid)) {
          remove(oldLast10, (item) => item === nodeid)
        }

        set({
          lastOpened: [...oldLast10.slice(-10 + 1), nodeid]
        })
      },
      update: (lastOpened: string[]) =>
        set({
          lastOpened
        }),
      initRecents: (recentList) => set({ lastOpened: recentList })
    }),
    {
      name: 'recents'
    }
  )
)
