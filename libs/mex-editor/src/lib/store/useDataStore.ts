import { DataStoreState, IDBStorage, mog } from '@mexit/core'
import { dataStoreConstructor, sanatizeLinks } from '@mexit/shared'
import { useMemo } from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, { name: 'mexit-data-store', getStorage: () => IDBStorage })
)

export { useDataStore }
