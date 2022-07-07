import create from 'zustand'
import { persist } from 'zustand/middleware'

import { DataStoreState } from '@mexit/core'
import { dataStoreConstructor } from '@mexit/shared'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, { name: 'mexit-data-store', version: 1, getStorage: () => asyncLocalStorage })
)

export default useDataStore
