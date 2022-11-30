import { contentStoreConstructor, ContentStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useContentStore = create<ContentStoreState>(
  persist(contentStoreConstructor, {
    name: 'mexit-content-store',
    getStorage: () => asyncLocalStorage
  })
)
