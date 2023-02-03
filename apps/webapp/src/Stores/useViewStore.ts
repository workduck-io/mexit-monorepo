import create from 'zustand'
import { persist } from 'zustand/middleware'

import { ViewStore, viewStoreConstructor } from '@mexit/core'

export const useViewStore = create<ViewStore>(
  persist(viewStoreConstructor, {
    name: 'mexit-view-store'
  })
)
