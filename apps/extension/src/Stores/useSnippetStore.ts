import create from 'zustand'
import { persist } from 'zustand/middleware'

import { snippetStoreConstructor, SnippetStoreState } from '@mexit/core'
import { storageAdapter } from '../Utils/chromeStorageAdapter'

export const useSnippetStore = create<SnippetStoreState>(
  persist(snippetStoreConstructor, { name: 'mexit-snippets', ...storageAdapter })
)
