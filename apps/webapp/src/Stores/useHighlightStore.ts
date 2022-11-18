import create from 'zustand'
import { persist } from 'zustand/middleware'

import { HighlightStore, HighlightStore2, highlightStoreConstructor, highlightStoreConstructor2 } from '@mexit/core'

// DEPRECATED
export const useHighlightStore = create<HighlightStore>(
  persist(highlightStoreConstructor, {
    name: 'highlights-store'
  })
)

export const useHighlightStore2 = create<HighlightStore2>(
  persist(highlightStoreConstructor2, {
    name: 'highlights-store-2'
  })
)
