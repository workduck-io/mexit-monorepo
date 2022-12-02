import create from 'zustand'
import { persist } from 'zustand/middleware'

import { LinkStore, linkStoreConstructor } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useLinkStore = create<LinkStore>(
  persist(linkStoreConstructor, {
    name: 'mexit-link-store',
    getStorage: () => asyncLocalStorage
  })
)
