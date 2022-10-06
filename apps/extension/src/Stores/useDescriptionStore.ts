import create from 'zustand'
import { persist } from 'zustand/middleware'

import { descriptionStoreConstructor, DescriptionStoreState } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useDescriptionStore = create<DescriptionStoreState>(
  persist(descriptionStoreConstructor, {
    name: 'mexit-description-store',
    getStorage: () => asyncLocalStorage
  })
)
