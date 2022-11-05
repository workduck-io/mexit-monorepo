import { LastOpenedNotes, UserPreferences } from '../Types/userPreference'

export interface UserPreferenceStore extends UserPreferences {
  _hasHydrated: boolean
  setHasHydrated: (state) => void
  setTheme: (theme: string) => void
  setLastOpenedNotes: (lastOpenedNotes: LastOpenedNotes) => void
  getUserPreferences: () => UserPreferences
  setUserPreferences: (userPreferences: UserPreferences) => void
  excludeSmartCaptureField: (page: string, fieldId: string) => void
  removeExcludedSmartCaptureField: (page: string, fieldId: string) => void
  setActiveNamespace: (namespace: string) => void
}

export const preferenceStoreConstructor = (set, get) => ({
  lastOpenedNotes: {},
  version: 'unset',
  smartCaptureExcludedFields: {},
  theme: 'xeM',
  _hasHydrated: false,
  excludeSmartCaptureField: (page: string, fieldId: string) => {
    const webPageConfigs = get().smartCaptureExcludedFields

    set({ smartCaptureExcludedFields: { ...webPageConfigs, [page]: [...(webPageConfigs[page] ?? []), fieldId] } })
  },
  removeExcludedSmartCaptureField: (page: string, fieldId: string) => {
    const webPageConfigs = get().smartCaptureExcludedFields

    if (webPageConfigs[page]) {
      const newConfig = webPageConfigs[page].filter((i) => i !== fieldId)
      set({ smartCaptureExcludedFields: { ...webPageConfigs, [page]: newConfig } })
    }
  },
  setHasHydrated: (state) => {
    set({
      _hasHydrated: state
    })
  },
  getUserPreferences: () => {
    return {
      lastOpenedNotes: get().lastOpenedNotes,
      version: get().version,
      smartCapture: get().smartCapture,
      theme: get().theme
    }
  },
  setUserPreferences: (userPreferences: UserPreferences) => {
    set(userPreferences)
  },
  setTheme: (theme) => {
    set({ theme })
  },
  setActiveNamespace: (namespace: string) => {
    set({ activeNamespace: namespace })
  },
  setLastOpenedNotes: (lastOpenedNotes) => {
    set({
      lastOpenedNotes: lastOpenedNotes
    })
  }
})

/**
 * Merging user preferences from the remote server with the local preferences
 *
 * The remote user preferences may be lagging as the local preferences
 * have not been saved on exit
 */
export const mergeUserPreferences = (local: UserPreferences, remote: UserPreferences): UserPreferences => {
  const { version, lastOpenedNotes, theme, smartCaptureExcludedFields } = local
  const { lastOpenedNotes: remoteLastOpenedNotes } = remote

  // For all lastOpened of remote
  const mergedLastOpenedNotes = Object.keys(remoteLastOpenedNotes).reduce((acc, key) => {
    const localLastOpenedNote = lastOpenedNotes[key]
    const remoteLastOpenedNote = remoteLastOpenedNotes[key]
    // If a local lastOpenedNote exists
    if (localLastOpenedNote) {
      // Get the latest of the two which has the latest lastOpened
      const latestLastOpened =
        Math.max(localLastOpenedNote.ts, remoteLastOpenedNote.ts) === localLastOpenedNote.ts
          ? localLastOpenedNote
          : remoteLastOpenedNote
      acc[key] = latestLastOpened
    } else {
      // If no local lastOpenedNote exists
      acc[key] = remoteLastOpenedNote
    }
    return acc
  }, {})

  return {
    version,
    // Overwrite all notes with the remote notes which exist
    // The local notes which do not exist in the remote notes will be left alone
    lastOpenedNotes: { ...lastOpenedNotes, ...mergedLastOpenedNotes },
    theme,
    smartCaptureExcludedFields
  }
}
