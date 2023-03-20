import { AppInitStatus } from '../Types/Auth'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const authStoreConfig = (set, get) => ({
  isForgottenPassword: false,
  authenticated: false,
  registered: false,
  userDetails: undefined as any,
  appInitStatus: AppInitStatus.START,
  setAppInitStatus: (appInitStatus: AppInitStatus) => set({ appInitStatus }),
  workspaceDetails: undefined as any,
  setIsUserAuthenticated: () => set({ authenticated: true, appInitStatus: AppInitStatus.COMPLETE }),
  setAuthenticated: (userDetails, workspaceDetails) =>
    set({ appInitStatus: AppInitStatus.RUNNING, userDetails, workspaceDetails, registered: false }),
  // setAuthenticatedUserDetails: (userDetails: UserDetails) => set({ authenticated: true, userDetails }),
  setUnAuthenticated: () =>
    set({
      authenticated: false,
      userDetails: undefined as any,
      appInitStatus: AppInitStatus.START,
      workspaceDetails: undefined as any
    }),
  setRegistered: (val: boolean) => set({ registered: val }),
  setIsForgottenPassword: (val: boolean) => set({ isForgottenPassword: val }),
  getWorkspaceId: () => {
    const workspaceDetails = get().workspaceDetails
    if (workspaceDetails) {
      return workspaceDetails.id
    }
    return undefined
  },
  updateUserDetails: (userDetails) => {
    set({ userDetails: { ...get().userDetails, ...userDetails } })
  }
})

export const useAuthStore = createStore(authStoreConfig, StoreIdentifier.AUTHSTORE, true)
