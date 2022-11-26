import create from 'zustand'
import { persist } from 'zustand/middleware'

import { HighlightStore, highlightStoreConstructor } from '@mexit/core'

export const useHighlightStore = create<HighlightStore>(
  persist(highlightStoreConstructor, {
    name: 'highlights-store',
    version: 2
  })
)
