import create from 'zustand'
import { persist } from 'zustand/middleware'

import { contentStoreConstructor, ContentStoreState, IDBStorage } from '@mexit/core'

const useContentStore = create<ContentStoreState>(
  persist(contentStoreConstructor, {
    name: 'mexit-content-store',
    getStorage: () => IDBStorage,
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    }
  })
)

export { useContentStore }
