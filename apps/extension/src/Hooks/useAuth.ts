import { authStoreConstructor, AuthStoreState } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'
import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create<AuthStoreState>(
  persist(authStoreConstructor, { name: 'mexit-authstore', getStorage: () => asyncLocalStorage })
)
