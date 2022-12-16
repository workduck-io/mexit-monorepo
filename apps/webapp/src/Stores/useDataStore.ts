import create from 'zustand'
import { persist } from 'zustand/middleware'

import { dataStoreConstructor, DataStoreState, IDBStorage, StorePersistentKeys } from '@mexit/core'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, {
    name: StorePersistentKeys.DATA,
    version: 2,
    getStorage: () => IDBStorage,
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    }
  })
)

export { useDataStore }
