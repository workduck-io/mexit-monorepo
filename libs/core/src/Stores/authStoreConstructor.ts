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
