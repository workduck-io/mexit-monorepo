import { client } from '@workduck-io/dwindle'

import { apiURLs, mog } from '@mexit/core'
import { UserPreferences } from '@mexit/shared'

import { version } from '../../../package.json'
import { useAuthStore } from '../../Stores/useAuth'
import { useUserCacheStore } from '../../Stores/useUserCacheStore'
import { useUserPreferenceStore } from '../../Stores/userPreferenceStore'
import { useAPIHeaders } from './useAPIHeaders'
import { USER_ID_REGEX } from '../../Utils/constants'

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
      return await client.get<any>(apiURLs.user.getFromEmail(email)).then((resp) => {
        mog('Response', { data: resp.data })
        if (resp?.data?.userId && resp?.data?.name) {
          addUser({
            email,
            userID: resp?.data?.userId,
            alias: resp?.data?.alias ?? resp?.data?.name,
            name: resp?.data?.name
          })
        }
        return {
          email,
          userID: resp?.data?.userId,
          alias: resp?.data?.alias ?? resp?.data?.name,
          name: resp?.data?.name
        }
      })
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
      return await client.get(apiURLs.user.getFromUserId(userID)).then((resp: any) => {
        mog('Response', { data: resp.data })
        if (resp?.data?.email && resp?.data?.name) {
          addUser({
            userID,
            email: resp?.data?.email,
            alias: resp?.data?.alias ?? resp?.data?.name,
            name: resp?.data?.name
          })
        }
        return {
          userID,
          email: resp?.data?.email ?? undefined,
          alias: resp?.data?.alias ?? resp?.data?.name,
          name: resp?.data?.name
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
      return await client
        .put(apiURLs.user.updateInfo, { id: userID, name, alias }, { headers: workspaceHeaders() })
        .then((resp: any) => {
          mog('Response', { data: resp.data })
          updateUserDetails({ name: resp?.data?.name, alias: resp?.data?.alias })
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
      return await client
        .put(apiURLs.user.updateInfo, { id: userID, preference: userPreferences }, { headers: workspaceHeaders() })
        .then((resp) => {
          return true
        })
    } catch (e) {
      mog('Error Updating User Info', { error: e, userID })
      return false
    }
  }

  const getCurrentUser = async (): Promise<UserDetails | undefined> => {
    try {
      return await client.get<UserDetails>(apiURLs.user.getUserRecords).then((resp) => {
        mog('Response', { data: resp.data })
        return resp?.data
      })
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
