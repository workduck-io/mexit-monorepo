import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { TabGroup } from '../Types/Tabs'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

interface TabCaptureStore {
  TabCaptures: TabGroup[]
  addTabCapture: (TabCapture: TabGroup) => any
  removeTabCapture: (TabCapture: TabGroup) => void
}

export const useTabCaptureStore = create<TabCaptureStore>()(
  persist(
    (set, get) => ({
      TabCaptures: new Array<TabGroup>(),
      addTabCapture: (TabCapture: TabGroup) => {
        const idx = get()
          .TabCaptures.map((t) => t.name)
          .indexOf(TabCapture.name)

        if (idx !== -1) {
          return { error: `Tab Group with name ${TabCapture.name} already exists`, message: null }
        } else {
          set({ TabCaptures: [...get().TabCaptures, TabCapture] })
          return { error: null, message: 'Success' }
        }
      },
      removeTabCapture: (TabCapture: TabGroup) => {
        const TabCaptures = get().TabCaptures
        const idx = TabCaptures.map((e) => e.id).indexOf(TabCapture.id)
        TabCaptures.splice(idx, 1)
        set({ TabCaptures: TabCaptures })
      }
    }),
    { name: 'mexit-tab-captures', getStorage: () => asyncLocalStorage }
  )
)
