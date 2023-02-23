import { API, mog, UserPreferences } from '@mexit/core'

import { useAuthStore } from '../../Stores/useAuth'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { useUserCacheStore } from '../../Stores/useUserCacheStore'
import { USER_ID_REGEX } from '../../Utils/constants'

import { useAPIHeaders } from './useAPIHeaders'

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
  const { workspaceHeaders } = useAPIHeaders()

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
        mog('Response', { data: resp })
        updateUserDetails({ name: resp?.name, alias: resp?.alias })
        return true
      })
    } catch (e) {
      mog('Error Updating User Info', { error: e, id })
      return false
    }
  }

  const updateUserPreferences = async (): Promise<boolean> => {
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

  const getAllKnownUsers = () => {
    const cache = useUserCacheStore.getState().cache
    return cache
  }

  return {
    getAllKnownUsers,
    getUserDetails,
    getUserDetailsUserId,
    updateUserInfo,
    updateUserPreferences,
    getCurrentUser
  }
}
