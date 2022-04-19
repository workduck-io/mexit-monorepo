import create from 'zustand'
import { persist } from 'zustand/middleware'

import { storageAdapter } from '../Utils/chromeStorageAdapter'

export interface UserDetails {
  email: string
  userId: string
  activityNodeUID?: string
}

export interface WorkspaceDetails {
  name: string
  id: string
}

export interface AuthStoreState {
  authenticated: boolean
  registered: boolean
  userDetails: undefined | UserDetails
  workspaceDetails: undefined | WorkspaceDetails
  setAuthenticated: (userDetails: UserDetails, workspaceDetails: WorkspaceDetails) => void
  setUnAuthenticated: () => void
  setRegistered: (val: boolean) => void
  getWorkspaceId: () => string | undefined
}

export const authStoreConstructor = (set, get) => ({
  authenticated: false,
  registered: false,
  userDetails: undefined,
  workspaceDetails: undefined,
  setAuthenticated: (userDetails, workspaceDetails) =>
    set({ authenticated: true, userDetails, workspaceDetails, registered: false }),
  setUnAuthenticated: () => set({ authenticated: false, userDetails: undefined, workspaceDetails: undefined }),
  setRegistered: (val) => set({ registered: val }),
  getWorkspaceId: () => {
    const workspaceDetails = get().workspaceDetails
    if (workspaceDetails) {
      return workspaceDetails.id
    }
    return undefined
  }
})

export const useAuthStore = create<AuthStoreState>(
  persist(authStoreConstructor, { name: 'mexit-authstore', ...storageAdapter })
)
