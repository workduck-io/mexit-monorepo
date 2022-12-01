import { UserCacheState, userCacheStoreConstructor } from '@mexit/core'

import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserCacheStore = create<UserCacheState>(
  persist(userCacheStoreConstructor, {
    name: 'mexit-user-cache'
  })
)
