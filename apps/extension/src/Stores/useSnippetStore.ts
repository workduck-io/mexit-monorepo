import create from 'zustand'
import { persist } from 'zustand/middleware'

import { snippetStoreConstructor, SnippetStoreState } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useSnippetStore = create<SnippetStoreState>(
  persist(snippetStoreConstructor, {
    name: 'mexit-snippets',
    getStorage: () => asyncLocalStorage,
    onRehydrateStorage: () => (state) => {
      state.setHasHydrated(true)
    }
  })
)
