import { contentStoreConstructor, ContentStoreState } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useContentStore = create<ContentStoreState>(
  persist(contentStoreConstructor, {
    name: 'mexit-content-store',
    getStorage: () => asyncLocalStorage
  })
)
