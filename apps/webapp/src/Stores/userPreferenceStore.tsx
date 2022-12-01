import { IDBStorage } from '@mexit/core'
import { preferenceStoreConstructor, UserPreferenceStore } from '@mexit/shared'

import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const USER_PREF_STORE_KEY = 'mex-user-preference-store'

export const useUserPreferenceStore = create<UserPreferenceStore>(
  persist(devtools(preferenceStoreConstructor, { name: 'User Preferences' }), {
    name: USER_PREF_STORE_KEY,
    getStorage: () => IDBStorage,
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true)
    }
  })
)
