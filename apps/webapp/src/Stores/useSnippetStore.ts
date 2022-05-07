import create from 'zustand'
import { persist } from 'zustand/middleware'

import { snippetStoreConstructor, SnippetStoreState } from '@mexit/core'

import IDBStorage from '../Utils/idbStorageAdapter'

export const useSnippetStore = create<SnippetStoreState>(
  persist(snippetStoreConstructor, { name: 'mexit-snippet-store', getStorage: () => IDBStorage })
)
