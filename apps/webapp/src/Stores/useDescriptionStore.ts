import { descriptionStoreConstructor, DescriptionStoreState, IDBStorage } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useDescriptionStore = create<DescriptionStoreState>(
  persist(descriptionStoreConstructor, {
    name: 'mexit-description-store',
    getStorage: () => IDBStorage
  })
)
