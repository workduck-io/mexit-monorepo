import { useState } from 'react'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'

import { authStoreConstructor, AuthStoreState } from '@mexit/core'
import { storageAdapter } from '@mexit/core'

export const useAuthStore = create<AuthStoreState>(
  persist(authStoreConstructor, { name: 'mexit-authstore', ...storageAdapter })
)
