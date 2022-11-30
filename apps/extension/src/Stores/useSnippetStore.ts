import { snippetStoreConstructor, SnippetStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useSnippetStore = create<SnippetStoreState>(
  persist(snippetStoreConstructor, { name: 'mexit-snippets', getStorage: () => asyncLocalStorage })
)
