import create from 'zustand'
import { persist } from 'zustand/middleware'

import { descriptionStoreConstructor, DescriptionStoreState, IDBStorage, NodeEditorContent } from '@mexit/core'

export const useDescriptionStore = create<DescriptionStoreState>(
  persist(descriptionStoreConstructor, {
    name: 'mexit-description-store',
    getStorage: () => IDBStorage
  })
)
