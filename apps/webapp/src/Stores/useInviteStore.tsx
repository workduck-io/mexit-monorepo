import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { InviteStore, inviteStoreConstructor } from '@mexit/core'

export const useInviteStore = create<InviteStore>(
  devtools(
    persist(inviteStoreConstructor, {
      name: 'mexit-invite-store'
    }),
    { name: 'web-invite-store' }
  )
)
