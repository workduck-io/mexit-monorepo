import { HighlightStore, highlightStoreConstructor } from '@mexit/core'

import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useHighlightStore = create<HighlightStore>(
  persist(highlightStoreConstructor, {
    name: 'highlights-store',
    version: 2
  })
)
