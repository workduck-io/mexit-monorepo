import { LastOpenedData, LastOpenedNotes, LastUsedSnippets, UserPreferences } from '../Types/userPreference'

export interface UserPreferenceStore extends UserPreferences {
  _hasHydrated: boolean
  smartCaptureExcludedFields?: any
  setHasHydrated: (state) => void
  setTheme: (themeId: string, mode?: 'light' | 'dark') => void
  setLastOpenedNotes: (lastOpenedNotes: LastOpenedNotes) => void
  setLastUsedSnippets: (lastUsedSnippets: LastUsedSnippets) => void
  getUserPreferences: () => UserPreferences
  setUserPreferences: (userPreferences: UserPreferences) => void
  setActiveNamespace: (namespace: string) => void
  excludeSmartCaptureField: (page: string, fieldId: string) => void
  removeExcludedSmartCaptureField: (page: string, fieldId: string) => void
}

export const preferenceStoreConstructor = (set, get): UserPreferenceStore => ({
  _hasHydrated: false,
  version: 'unset',
  theme: { themeId: 'xeM', mode: 'dark' },
  lastOpenedNotes: {},
  lastUsedSnippets: {},
  smartCaptureExcludedFields: {},

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
      smartCaptureExcludedFields: get().smartCaptureExcludedFields,
      version: get().version,
      lastUsedSnippets: get().lastUsedSnippets,
      theme: get().theme
    }
  },
  setUserPreferences: (userPreferences: UserPreferences) => {
    set(userPreferences)
  },
  setTheme: (themeId, mode) => {
    const newPref = { themeId, mode: mode ?? get().theme.mode }
    set({ theme: newPref })
  },
  setActiveNamespace: (namespace: string) => {
    set({ activeNamespace: namespace })
  },
  setLastOpenedNotes: (lastOpenedNotes) => {
    set({
      lastOpenedNotes: lastOpenedNotes
    })
  },
  setLastUsedSnippets: (lastUsedSnippets) => {
    set({ lastUsedSnippets })
  }
})

export const mergeLastOpenedData = (
  remote: Record<string, LastOpenedData>,
  local: Record<string, LastOpenedData>
): Record<string, LastOpenedData> => {
  const merged = Object.keys(remote).reduce((acc, key) => {
    const localLastOpenedNote = local[key]
    const remoteLastOpenedNote = remote[key]
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

  return merged
}

/**
 * Merging user preferences from the remote server with the local preferences
 *
 * The remote user preferences may be lagging as the local preferences
 * have not been saved on exit
 */
export const mergeUserPreferences = (local: UserPreferences, remote: UserPreferences): UserPreferences => {
  // For all lastOpened of remote
  const mergedLastOpenedNotes = mergeLastOpenedData(remote.lastOpenedNotes, local.lastOpenedNotes)
  const mergedLastUsedSnippets = mergeLastOpenedData(remote.lastUsedSnippets, local.lastUsedSnippets)

  // mog('mergedLastOpenedNotes', { localLastOpenedNotes, mergedLastOpenedNotes, local, remote })
  return {
    version: local.version,
    // Overwrite all notes with the remote notes which exist
    // The local notes which do not exist in the remote notes will be left alone
    lastOpenedNotes: { ...local.lastOpenedNotes, ...mergedLastOpenedNotes },
    lastUsedSnippets: { ...local.lastUsedSnippets, ...mergedLastUsedSnippets },
    theme: remote.theme ?? local.theme,
    smartCaptureExcludedFields: local.smartCaptureExcludedFields
  }
}
