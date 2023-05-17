import { AppInitStatus, UserDetails, Workspace } from '../Types/Auth'
import { StoreIdentifier } from '../Types/Store'
import { getLocalStorage } from '../Utils/storage'
import { createStore } from '../Utils/storeCreator'

const getAuthStoreInitialState = () => ({
  registered: false,
  authenticated: false,
  isForgottenPassword: false,
  appInitStatus: AppInitStatus.START,

  users: [] as Array<UserDetails>,
  workspaces: [] as Array<Workspace>,
  userDetails: undefined as UserDetails | undefined,
  workspaceDetails: undefined as Workspace | undefined
})

const authStoreConfig = (set, get) => ({
  ...getAuthStoreInitialState(),

  // * User workspaces
  setWorkspaces: (workspaces: Array<Workspace>) => {
    const activeWorkspace = get().workspaceDetails
    const updatedWorkspaceDetails = workspaces?.find((i) => i.id === activeWorkspace?.id)

    set({ workspaces, ...(updatedWorkspaceDetails ? { workspaceDetails: updatedWorkspaceDetails } : {}) })
  },
  updateWorkspace: (workspace: Partial<Workspace>) => {
    const workspaces = get().workspaces
    const existingWorkspace = workspaces.find((w) => w.id === workspace.id)

    const updatedWorkspaceDetails = { ...existingWorkspace, ...workspace }

    set({
      workspaces: workspaces.map((w) => (w.id === workspace.id ? updatedWorkspaceDetails : w))
    })

    if (get().workspaceDetails?.id === workspace.id) {
      set({ workspaceDetails: updatedWorkspaceDetails })
    }
  },
  addWorkspace: (workspace: Workspace, active = false) => {
    const existing = get().workspaces.filter((i) => i.id !== workspace?.id)
    set({ workspaces: [...existing, workspace], ...(active ? { workspaceDetails: workspace } : {}) })
  },
  removeWorkspace: (workspaceId: string) => {
    const workspaces = get().workspaces.filter((workspace) => workspace.id !== workspaceId)
    set({ workspaces })
  },

  // Users of the current workspace
  setUsers: (users: Array<UserDetails>) => set({ users }),

  // * Change workspace and start init process by setting appInitStatus to AppInitStatus.RUNNING
  setActiveWorkspace: (workspaceId: string) => {
    const workspace = get().workspaces.find((w) => w.id === workspaceId)
    if (workspace) set({ workspaceDetails: workspace })
  },
  setAppInitStatus: (appInitStatus) => set({ appInitStatus }),
  setIsUserAuthenticated: () => set({ authenticated: true, appInitStatus: AppInitStatus.COMPLETE }),
  setAuthenticated: (userDetails: UserDetails, workspaceDetails) => {
    const workspaces = get().workspaces

    set({
      appInitStatus: AppInitStatus.RUNNING,
      workspaces: [...workspaces, workspaceDetails],
      userDetails,
      workspaceDetails,
      registered: false
    })
  },
  setUnAuthenticated: () => {
    const initState = getAuthStoreInitialState()
    set(initState)
  },
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
    web: getLocalStorage()
  }
})
