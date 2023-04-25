import { useEffect } from 'react'

import { mergeUserPreferences, useAuthStore, userPreferenceStore as useUserPreferenceStore } from '@mexit/core'

import { useUserService } from './API/useUserAPI'

const USER_PREF_AUTO_SAVE_MS = 30 * 60 * 1000 // 30 minutes

export const useUserPreferences = () => {
  const { getCurrentUser } = useUserService()
  const getUserPreferences = useUserPreferenceStore((s) => s.getUserPreferences)
  const setUserPreferences = useUserPreferenceStore((store) => store.setUserPreferences)

  const updateCurrentUserPreferences = async () => {
    const user = await getCurrentUser()

    if (user) {
      const userPreferences = user.preference
      // mog('User Preferences Fetched: ', { userPreferences })
      if (userPreferences) {
        const localUserPreferences = getUserPreferences()
        const mergedUserPreferences = mergeUserPreferences(localUserPreferences, userPreferences)
        setUserPreferences(mergedUserPreferences)
      }
    }
  }

  return { updateCurrentUserPreferences }
}

export const useAutoSyncUserPreference = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const { updateUserPreferences } = useUserService()

  /**
   * Saves the user preference at every interval
   */
  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(() => {
        updateUserPreferences()
      }, USER_PREF_AUTO_SAVE_MS)

      return () => clearInterval(intervalId)
    }
  }, [isAuthenticated])
}
