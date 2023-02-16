/* Dwindle Internal Store for Auth */

import { CognitoUser, ICognitoUserPoolData } from 'amazon-cognito-identity-js'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export interface UserCred {
  email: string
  userId: string
  token: string
  expiry: number
  url: string
  refresh_token: string
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

  setAllStore: (data: any) => void
}

const useInternalAuthStore = create<InternalAuthStoreState>(
  devtools(
    persist(
      (set, get) => ({
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
          }),

        setAllStore: ({ userCred, userPool }) => {
          set({ userCred, userPool })
        }
      }),
      { name: 'aws-auth-mexit', getStorage: () => asyncLocalStorage }
    ),
    {
      name: 'hello-world'
    }
  )
)

export default useInternalAuthStore
