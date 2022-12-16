import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { contentStoreConstructor, ContentStoreState, IDBStorage, StorePersistentKeys } from '@mexit/core'

const useContentStore = create<ContentStoreState>(
  devtools(
    persist(contentStoreConstructor, {
      name: StorePersistentKeys.CONTENTS,
      getStorage: () => IDBStorage,
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      }
    }),
    { name: 'contents-webapp' }
  )
)

export { useContentStore }
