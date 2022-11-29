import { IDBStorage, snippetStoreConstructor, SnippetStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useSnippetStore = create<SnippetStoreState>(
  persist(snippetStoreConstructor, {
    name: 'mexit-snippet-store',
    getStorage: () => IDBStorage,
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    }
  })
)
