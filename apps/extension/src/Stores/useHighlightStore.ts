import create from 'zustand'
import { persist } from 'zustand/middleware'

import { HighlightStore, highlightStoreConstructor } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useHighlightStore = create<HighlightStore>(
  persist(highlightStoreConstructor, {
    name: 'highlights-store',
    getStorage: () => asyncLocalStorage,
    version: 2
  })
)
