import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { dataStoreConstructor, DataStoreState, IDBStorage, StorePersistentKeys } from '@mexit/core'

const useDataStore = create<DataStoreState>(
  devtools(
    persist(dataStoreConstructor, {
      name: StorePersistentKeys.DATA,
      version: 2,
      getStorage: () => IDBStorage,
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      }
    }),
    { name: 'DATA_STORE' }
  )
)

export { useDataStore }
