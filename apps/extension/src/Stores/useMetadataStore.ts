import create from 'zustand'
import { persist } from 'zustand/middleware'

import { metadataStoreConstructor, MetaDataStoreType } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useMetadataStore = create<MetaDataStoreType>(
  persist(metadataStoreConstructor, {
    name: 'mexit-metadata-store',
    getStorage: () => asyncLocalStorage
  })
)