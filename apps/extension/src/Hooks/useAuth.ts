import create from 'zustand'
import { persist } from 'zustand/middleware'

import { authStoreConstructor, AuthStoreState } from '@mexit/core'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useAuthStore = create<AuthStoreState>(
  persist(authStoreConstructor, { name: 'mexit-authstore', getStorage: () => asyncLocalStorage })
)
