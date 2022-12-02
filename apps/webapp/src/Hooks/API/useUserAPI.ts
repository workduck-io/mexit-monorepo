import { API, mog } from '@mexit/core'
import { UserPreferences } from '@mexit/shared'

import { version } from '../../../package.json'
import { useAuthStore } from '../../Stores/useAuth'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { useUserCacheStore } from '../../Stores/useUserCacheStore'
import { USER_ID_REGEX } from '../../Utils/constants'

import { useAPIHeaders } from './useAPIHeaders'

export interface TempUser {
  email: string
  userID?: string
  alias?: string
  name?: string
}

export interface TempUserUserID {
  userID: string
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
      return await API.user.getByMail(email)
    } catch (e) {
      mog('Error Fetching User Details', { error: e, email })
      return { email }
    }
  }

  const getUserDetailsUserId = async (userID: string): Promise<TempUserUserID> => {
    // Get from cache
    const user = getUser({ userID })
    if (user) return user

    // Check if the userid is of valid format
    const match = userID.match(USER_ID_REGEX)
    if (!match) return { userID }

    try {
      return await API.user.getByID(userID).then((resp) => {
        mog('Response', { data: resp })
        if (resp?.email && resp?.name) {
          addUser({
            userID,
            email: resp?.email,
            alias: resp?.alias ?? resp?.name,
            name: resp?.name
          })
        }
        return {
          userID,
          email: resp?.email ?? undefined,
          alias: resp?.alias ?? resp?.name,
          name: resp?.name
        }
      })
    } catch (e) {
      mog('Error Fetching User Details', { error: e, userID })
      return { userID }
    }
  }

  const updateUserInfo = async (userID: string, name?: string, alias?: string): Promise<boolean> => {
    try {
      if (name === undefined && alias === undefined) return false
      return await API.user.updateInfo({ id: userID, name, alias }).then((resp) => {
        mog('Response', { data: resp })
        updateUserDetails({ name: resp?.name, alias: resp?.alias })
        return true
      })
    } catch (e) {
      mog('Error Updating User Info', { error: e, userID })
      return false
    }
  }

  const updateUserPreferences = async (): Promise<boolean> => {
    const lastOpenedNotes = useUserPreferenceStore.getState().lastOpenedNotes
    const lastUsedSnippets = useUserPreferenceStore.getState().lastUsedSnippets
    const theme = useUserPreferenceStore.getState().theme
    const smartCaptureExcludedFields = useUserPreferenceStore.getState().smartCaptureExcludedFields
    const userID = useAuthStore.getState().userDetails.userID

    const userPreferences: UserPreferences = {
      version,
      lastOpenedNotes,
      lastUsedSnippets,
      smartCaptureExcludedFields,
      theme
    }

    try {
      return await API.user.updatePreference(userID, userPreferences).then((resp) => {
        return true
      })
    } catch (e) {
      mog('Error Updating User Info', { error: e, userID })
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
