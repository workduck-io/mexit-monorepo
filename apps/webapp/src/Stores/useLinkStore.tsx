import create from 'zustand'
import { persist } from 'zustand/middleware'

import { LinkStore, linkStoreConstructor } from '@mexit/core'

export const useLinkStore = create<LinkStore>(
  persist(linkStoreConstructor, {
    name: 'mexit-link-store'
  })
)
