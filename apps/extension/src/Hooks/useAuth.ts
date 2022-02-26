import { useState } from 'react'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

import { authStoreConstructor, AuthStoreState } from '@mexit/shared'
import { storageAdapter } from '@mexit/shared'

export const useAuthStore = create<AuthStoreState>(
  persist(authStoreConstructor, { name: 'mexit-authstore', ...storageAdapter })
)
