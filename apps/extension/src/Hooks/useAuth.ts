import { authStoreConstructor, AuthStoreState } from '@mexit/core'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useAuthStore = create<AuthStoreState>(
  persist(authStoreConstructor, { name: 'mexit-authstore', getStorage: () => asyncLocalStorage })
)
