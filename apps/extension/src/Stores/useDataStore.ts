import create from 'zustand'
import { persist } from 'zustand/middleware'

import { DataStoreState, storageAdapter } from '@mexit/core'

import { dataStoreConstructor } from '@mexit/shared'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, { name: 'mexit-data-store', ...storageAdapter })
)

export default useDataStore
