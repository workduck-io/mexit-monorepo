import create from 'zustand'
import { persist } from 'zustand/middleware'

import { dataStoreConstructor, DataStoreState, IDBStorage } from '@mexit/core'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, {
    name: 'mexit-data-store',
    version: 2,
    getStorage: () => IDBStorage,
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    }
  })
)

export { useDataStore }
