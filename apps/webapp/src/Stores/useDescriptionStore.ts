import create from 'zustand'
import { persist } from 'zustand/middleware'

import { descriptionStoreConstructor, DescriptionStoreState, IDBStorage } from '@mexit/core'

export const useDescriptionStore = create<DescriptionStoreState>(
  persist(descriptionStoreConstructor, {
    name: 'mexit-description-store',
    getStorage: () => IDBStorage
  })
)
