import { AppInitStatus } from '../Types/Auth'
import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

export const authStoreConfig = (set, get) => ({
  isForgottenPassword: false,
  authenticated: false,
  registered: false,
  userDetails: undefined,
  appInitStatus: AppInitStatus.START,
  setAppInitStatus: (appInitStatus) => set({ appInitStatus }),
  workspaceDetails: undefined,
  setIsUserAuthenticated: () => set({ authenticated: true, appInitStatus: AppInitStatus.COMPLETE }),
  setAuthenticated: (userDetails, workspaceDetails) =>
    set({ appInitStatus: AppInitStatus.RUNNING, userDetails, workspaceDetails, registered: false }),
  // setAuthenticatedUserDetails: (userDetails: UserDetails) => set({ authenticated: true, userDetails }),
  setUnAuthenticated: () =>
    set({
      authenticated: false,
      userDetails: undefined,
      appInitStatus: AppInitStatus.START,
      workspaceDetails: undefined
    }),
  setRegistered: (val) => set({ registered: val }),
  setIsForgottenPassword: (val) => set({ isForgottenPassword: val }),
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
