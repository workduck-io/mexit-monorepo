import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { LinkStore, linkStoreConstructor } from '@mexit/core'

export const useLinkStore = create<LinkStore>(
  devtools(
    persist(linkStoreConstructor, {
      name: 'mexit-link-store'
    }),
    { name: 'web-link-store' }
  )
)
