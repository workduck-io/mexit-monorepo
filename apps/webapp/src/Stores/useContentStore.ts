import create from 'zustand'
import { persist } from 'zustand/middleware'

import { contentStoreConstructor, ContentStoreState, IDBStorage, StorePersistentKeys } from '@mexit/core'

const useContentStore = create<ContentStoreState>(
  persist(contentStoreConstructor, {
    name: StorePersistentKeys.CONTENTS,
    getStorage: () => IDBStorage,
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    }
  })
)

export { useContentStore }
