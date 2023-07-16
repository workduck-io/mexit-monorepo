import {
  API,
  BackupStorage,
  getMIcon,
  mog,
  useAuthStore,
  UserPreferences,
  userPreferenceStore as useUserPreferenceStore,
  useUserCacheStore
} from '@mexit/core'

import { USER_ID_REGEX } from '../../Utils/constants'

export interface TempUser {
  email: string
  id?: string
  alias?: string
  name?: string
}

export interface TempUserUserID {
  id: string
  email?: string
  alias?: string
  name?: string
}

export interface UserDetails {
  /** User ID */
  id: string
  /** Workspace ID */
  group: string
  entity: 'User'
  email: string
  name: string
  alias: string
  preference: UserPreferences
}

export const useUserService = () => {
  const addUser = useUserCacheStore((s) => s.addUser)
  const getUser = useUserCacheStore((s) => s.getUser)
  const updateUserDetails = useAuthStore((s) => s.updateUserDetails)
  const setWorkspaces = useAuthStore((store) => store.setWorkspaces)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const updateWorkspace = useAuthStore((store) => store.updateWorkspace)
  const setpreferenceModifiedAt = useUserPreferenceStore((store) => store.setpreferenceModifiedAt)

  const getUserDetails = async (email: string): Promise<TempUser> => {
    const user = getUser({ email })
    if (user) return user

    try {
      return (await API.user.getByMail(email)) as TempUser
    } catch (e) {
      mog('Error Fetching User Details', { error: e, email })
      return { email }
    }
  }

  const getUserDetailsUserId = async (id: string): Promise<TempUserUserID> => {
    // Get from cache
    const user = getUser({ id })
    if (user) return user

    // Check if the userid is of valid format
    const match = id.match(USER_ID_REGEX)
    if (!match) return { id }
    try {
      return await API.user.getByID(id).then((resp: any) => {
        if (resp?.metadata?.email && resp?.name) {
          addUser({
            id,
            email: resp?.metadata?.email,
            alias: resp?.alias ?? resp?.name,
            name: resp?.name
          })
        }

        return {
          id,
          email: resp?.metadata?.email ?? undefined,
          alias: resp?.alias ?? resp?.name,
          name: resp?.name
        }
      })
    } catch (e) {
      mog('Error Fetching User Details', { error: e, id })
      return { id }
    }
  }

  const updateUserInfo = async (id: string, name?: string, alias?: string): Promise<boolean> => {
    try {
      if (name === undefined && alias === undefined) return false
      return await API.user.updateInfo({ id, name, alias }).then((resp: any) => {
        updateUserDetails({ name: resp?.name, alias: resp?.alias })
        return true
      })
    } catch (e) {
      mog('Error Updating User Info', { error: e, id })
      return false
    }
  }

  const updateUserPreferences = async (): Promise<boolean> => {
    setpreferenceModifiedAt(Date.now())

    const id = useAuthStore.getState().userDetails.id
    const getUserPreferences = useUserPreferenceStore.getState().getUserPreferences

    const userPreferences: UserPreferences = getUserPreferences()

    try {
      return await API.user.updatePreference(userPreferences).then((resp) => {
        return true
      })
    } catch (e) {
      mog('Error Updating User Info', { error: e, userId: id })
      return false
    }
  }

  const getCurrentUser = async (): Promise<UserDetails | undefined> => {
    try {
      return await API.user.getCurrent()
    } catch (e) {
      mog('Error Fetching Current User Info', { error: e })
      return undefined
    }
  }

  const getAllWorkspaces = async (): Promise<any> => {
    try {
      const workspaces = await API.workspace.getAllWorkspaces()

      if (workspaces?.length > 0) {
        BackupStorage.createObjectStore(workspaces.map((item) => item.id))
        setWorkspaces(workspaces)
      }
    } catch (e) {
      mog('Error Fetching All Workspaces', { error: e })
      return undefined
    }
  }

  const updateWorkspaceDetails = async (id: string, data: Record<string, any>): Promise<void> => {
    try {
      await API.workspace.update(data)

      const metadata = data?.workspaceMetadata

      if (metadata) {
        const { workspaceMetadata, ...rest } = data
        updateWorkspace({ id, icon: getMIcon('URL', metadata.imageUrl), ...rest })
      } else updateWorkspace({ id, ...data })
    } catch (e) {
      mog('Error Fetching All Workspaces', { error: e })
    }
  }

  const getAllKnownUsers = () => {
    const cache = useUserCacheStore.getState().cache
    return cache
  }

  return {
    getAllKnownUsers,
    getUserDetails,
    getUserDetailsUserId,
    updateUserInfo,
    updateWorkspaceDetails,
    updateUserPreferences,
    getAllWorkspaces,
    getCurrentUser
  }
}
