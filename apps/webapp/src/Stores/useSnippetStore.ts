import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { IDBStorage, snippetStoreConstructor, SnippetStoreState } from '@mexit/core'

export const useSnippetStore = create<SnippetStoreState>(
  devtools(
    persist(snippetStoreConstructor, {
      name: 'mexit-snippet-store',
      getStorage: () => IDBStorage,
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      }
    }),
    {
      name: 'Snippets'
    }
  )
)
