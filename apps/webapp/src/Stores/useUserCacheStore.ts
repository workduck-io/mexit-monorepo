import create from 'zustand'
import { persist } from 'zustand/middleware'

import { UserCacheState, userCacheStoreConstructor } from '@mexit/core'

export const useUserCacheStore = create<UserCacheState>(
  persist(userCacheStoreConstructor, {
    name: 'mexit-user-cache'
  })
)
