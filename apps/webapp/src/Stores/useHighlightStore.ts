import create from 'zustand'
import { persist } from 'zustand/middleware'

import { HighlightStore2, highlightStoreConstructor2 } from '@mexit/core'

export const useHighlightStore2 = create<HighlightStore2>(
  persist(highlightStoreConstructor2, {
    name: 'highlights-store',
    version: 2
  })
)
