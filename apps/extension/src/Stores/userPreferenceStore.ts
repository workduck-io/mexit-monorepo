import { preferenceStoreConstructor, UserPreferenceStore } from '@mexit/shared'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const USER_PREF_STORE_KEY = 'mex-user-preference-store'

export const useUserPreferenceStore = create<UserPreferenceStore>(
  persist(devtools(preferenceStoreConstructor, { name: 'User Preferences Extensions' }), {
    name: USER_PREF_STORE_KEY,
    getStorage: () => asyncLocalStorage,
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true)
    }
  })
)
