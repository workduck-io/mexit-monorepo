import create from 'zustand'
import { persist } from 'zustand/middleware'

import { DataStoreState, IDBStorage } from '@mexit/core'
import { dataStoreConstructor } from '@mexit/shared'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, {
    name: 'mexit-data-store',
    version: 1,
    getStorage: () => IDBStorage
  })
)

export { useDataStore }
