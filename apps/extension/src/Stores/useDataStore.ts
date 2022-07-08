import create from 'zustand'
import { persist } from 'zustand/middleware'

import { DataStoreState, dataStoreConstructor } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, { name: 'mexit-data-store', version: 1, getStorage: () => asyncLocalStorage })
)

export default useDataStore
