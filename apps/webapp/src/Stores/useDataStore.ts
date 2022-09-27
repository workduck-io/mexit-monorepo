import create from 'zustand'
import { persist } from 'zustand/middleware'

import { DataStoreState, IDBStorage, dataStoreConstructor } from '@mexit/core'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, {
    name: 'mexit-data-store',
    version: 2,
    getStorage: () => IDBStorage
  })
)

export { useDataStore }
