/* Dwindle Internal Store for Auth */

import { CognitoUser, ICognitoUserPoolData } from 'amazon-cognito-identity-js'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { storageAdapter } from '../Utils/asyncStorage'

export interface UserCred {
  email: string
  userId: string
  token: string
  expiry: number
  url: string
}

export interface InternalAuthStoreState {
  userPool: ICognitoUserPoolData | undefined
  setUserPool: (userPool: ICognitoUserPoolData) => void

  email: string | undefined

  user: CognitoUser | undefined
  setUser: (userPool: CognitoUser) => void
  userCred: UserCred | undefined
  setUserCred: (userCred: UserCred) => void
  setEmail: (email: string) => void

  clearStore: () => void
}

const useInternalAuthStore = create<InternalAuthStoreState>(
  persist(
    (set) => ({
      userPool: undefined,
      user: undefined,
      userCred: undefined,

      email: undefined,

      setUserPool: (userPool) => set({ userPool }),
      setUser: (user) => set({ user }),
      setEmail: (email) => set({ email }),
      setUserCred: (userCred) => set({ userCred }),

      clearStore: () =>
        set({
          user: undefined,
          userCred: undefined,
          email: undefined
        })
    }),
    { name: 'aws-auth-mex-extension', ...storageAdapter }
  )
)

export default useInternalAuthStore
