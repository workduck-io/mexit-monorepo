export const authStoreConstructor = (set, get) => ({
  isForgottenPassword: false,
  authenticated: false,
  registered: false,
  userDetails: undefined,
  workspaceDetails: undefined,
  setAuthenticated: (userDetails, workspaceDetails) =>
    set({ authenticated: true, userDetails, workspaceDetails, registered: false }),
  setUnAuthenticated: () => set({ authenticated: false, userDetails: undefined, workspaceDetails: undefined }),
  setRegistered: (val) => set({ registered: val }),
  setIsForgottenPassword: (val) => set({ isForgottenPassword: val }),
  getWorkspaceId: () => {
    const workspaceDetails = get().workspaceDetails
    if (workspaceDetails) {
      return workspaceDetails.id
    }
    return undefined
  }
})
