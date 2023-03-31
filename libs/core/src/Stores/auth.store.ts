import { AppInitStatus, UserDetails } from '../Types/Auth'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const authStoreConfig = (set, get) => ({
  isForgottenPassword: false,
  authenticated: false,
  registered: false,
  userDetails: undefined as UserDetails | undefined,
  appInitStatus: AppInitStatus.START,
  workspaceDetails: undefined,
  setAppInitStatus: (appInitStatus) => set({ appInitStatus }),
  setIsUserAuthenticated: () => set({ authenticated: true, appInitStatus: AppInitStatus.COMPLETE }),
  setAuthenticated: (userDetails: UserDetails, workspaceDetails) =>
    set({ appInitStatus: AppInitStatus.RUNNING, userDetails, workspaceDetails, registered: false }),
  // setAuthenticatedUserDetails: (userDetails: UserDetails) => set({ authenticated: true, userDetails }),
  setUnAuthenticated: () =>
    set({
      authenticated: false,
      userDetails: undefined,
      appInitStatus: AppInitStatus.START,
      workspaceDetails: undefined
    }),
  setRegistered: (registered: boolean) => set({ registered }),
  setIsForgottenPassword: (isForgottenPassword: boolean) => set({ isForgottenPassword }),
  getWorkspaceId: (): string | undefined => {
    const workspaceDetails = get().workspaceDetails
    if (workspaceDetails) {
      return workspaceDetails.id
    }

    return undefined
  },
  updateUserDetails: (userDetails: UserDetails) => {
    set({ userDetails: { ...get().userDetails, ...userDetails } })
  }
})

export const useAuthStore = createStore(authStoreConfig, StoreIdentifier.AUTH, true, {
  storage: {
    web: typeof window !== 'undefined' ? localStorage : undefined
  }
})
