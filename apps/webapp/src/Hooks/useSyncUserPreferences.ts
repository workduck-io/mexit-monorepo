import { mog } from '@mexit/core'
import { mergeUserPreferences } from '@mexit/shared'
import { useEffect } from 'react'

import { useAuthStore } from '../Stores/useAuth'
import { useUserPreferenceStore } from '../Stores/userPreferenceStore'
import { useUserService } from './API/useUserAPI'

const USER_PREF_AUTO_SAVE_MS = 30 * 60 * 1000 // 30 minutes

export const useAutoSyncUserPreference = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const getUserPreferences = useUserPreferenceStore((s) => s.getUserPreferences)
  const setUserPreferences = useUserPreferenceStore((store) => store.setUserPreferences)
  const hasHydrated = useUserPreferenceStore((s) => s._hasHydrated)
  const { updateUserPreferences, getCurrentUser } = useUserService()

  const updateCurrentUserPreferences = async () => {
    const user = await getCurrentUser()
    if (user) {
      const userPreferences = user.preference
      mog('User Preferences Fetched: ', { userPreferences })
      if (userPreferences) {
        const localUserPreferences = getUserPreferences()
        const mergedUserPreferences = mergeUserPreferences(localUserPreferences, userPreferences)
        setUserPreferences(mergedUserPreferences)
      }
    }
  }

  /**
   * Fetches the user preference once
   */
  useEffect(() => {
    // mog(`Fetching User Preferences`)
    if (hasHydrated) {
      // mog('Hydration finished')
      if (isAuthenticated) updateCurrentUserPreferences()
    }
  }, [hasHydrated, isAuthenticated])

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
