import create from 'zustand'
import { persist } from 'zustand/middleware'

import { IDBStorage, snippetStoreConstructor, SnippetStoreState } from '@mexit/core'

export const useSnippetStore = create<SnippetStoreState>(
  persist(snippetStoreConstructor, { name: 'mexit-snippet-store', getStorage: () => IDBStorage })
)
