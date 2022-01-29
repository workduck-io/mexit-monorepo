import { useState } from 'react'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiURLs } from '../routes'
import { RegisterFormData } from '../Types/Auth'
import client from '../Utils/fetchClient'
import useAuth from './useDwindle'

interface UserCred {
  email: string
  userId: string
  token: string
  expiry: number
  url: string
}

interface UserDetails {
  userId: string
  email: string
}

interface WorkspaceDetails {
  name: string
  id: string
}

interface AuthStoreState extends State {
  authenticated: boolean
  registered: boolean
  userDetails: undefined | UserDetails
  workspaceDetails: undefined | WorkspaceDetails
  setAuthenticated: (userDetails: UserDetails, workspaceDetails: WorkspaceDetails) => void
  setUnAuthenticated: () => void
  setRegistered: (val: boolean) => void
  getWorkspaceId: () => string | undefined
}

export const useAuthStore = create<AuthStoreState>(
  persist(
    (set, get) => ({
      authenticated: false,
      registered: false,
      userDetails: undefined,
      workspaceDetails: undefined,
      setAuthenticated: (userDetails, workspaceDetails) =>
        set({ authenticated: true, userDetails, workspaceDetails, registered: false }),
      // setAuthenticatedUserDetails: (userDetails: UserDetails) => set({ authenticated: true, userDetails }),
      setUnAuthenticated: () => set({ authenticated: false, userDetails: undefined, workspaceDetails: undefined }),
      setRegistered: (val) => set({ registered: val }),
      getWorkspaceId: () => {
        const workspaceDetails = get().workspaceDetails
        if (workspaceDetails) {
          return workspaceDetails.id
        }
        return undefined
      }
    }),
    { name: 'mexit-auth' }
  )
)

export const useAuthentication = () => {
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const { signIn, signOut, signUp, verifySignUp } = useAuth()

  const setRegistered = useAuthStore((store) => store.setRegistered)
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()

  const login = async (
    email: string,
    password: string,
    getWorkspace = false
  ): Promise<{ data: UserCred; v: string }> => {
    let data: any // eslint-disable-line @typescript-eslint/no-explicit-any
    const v = await signIn(email, password)
      .then((d) => {
        data = d
        return 'success'
      })
      .catch((e) => {
        console.error({ e })
        return e.toString() as string
      })

    if (getWorkspace && data !== undefined) {
      await client
        .get(apiURLs.getUserRecords(data.userId))
        .then((d: any) => {
          const userDetails = { email, userId: data.userId }
          const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }

          setAuthenticated(userDetails, workspaceDetails)
        })
        .then()
        .catch((e) => {
          console.error({ e })
          return e.toString() as string
        })
    }
    return { data, v }
  }

  const logout = () => {
    signOut().then(() => {
      setUnAuthenticated()
    })
  }

  return { login, logout }
}
