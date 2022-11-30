import { dataStoreConstructor,DataStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, { name: 'mexit-data-store', version: 2, getStorage: () => asyncLocalStorage })
)

export default useDataStore
