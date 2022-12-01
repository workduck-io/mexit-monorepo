import { LinkStore, linkStoreConstructor } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useLinkStore = create<LinkStore>(
  persist(linkStoreConstructor, {
    name: 'mexit-link-store',
    getStorage: () => asyncLocalStorage
  })
)
