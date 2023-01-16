import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { HighlightStore, highlightStoreConstructor } from '@mexit/core'

export const useHighlightStore = create<HighlightStore>(
  devtools(
    persist(highlightStoreConstructor, {
      name: 'highlights-store',
      version: 2
    }),
    { name: 'web-highlights' }
  )
)
