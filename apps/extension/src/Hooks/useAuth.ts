import { useState } from 'react'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

import { authStoreConstructor, AuthStoreState } from '@mexit/core'
import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export const useAuthStore = create<AuthStoreState>(
  persist(authStoreConstructor, { name: 'mexit-authstore', getStorage: () => asyncLocalStorage })
)
