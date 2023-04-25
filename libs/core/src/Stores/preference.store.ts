import merge from 'deepmerge'

import { StoreIdentifier } from '../Types/Store'
import {
  LastOpenedNotes,
  LastUsedSnippets,
  SpacePreference,
  SpacePreferenceData,
  UserPreferences
} from '../Types/UserPreference'
import { createStore } from '../Utils/storeCreator'

export interface UserPreferenceStore extends UserPreferences {
  smartCaptureExcludedFields?: any
  space: SpacePreference
  addSpacePreference: (spaceId: string, spacePreferenceData: Partial<SpacePreferenceData>) => void
  clear: () => void
  setTheme: (themeId: string, mode?: 'light' | 'dark') => void
  setLastOpenedNotes: (lastOpenedNotes: LastOpenedNotes) => void
  setLastUsedSnippets: (lastUsedSnippets: LastUsedSnippets) => void
  getUserPreferences: () => UserPreferences
  setUserPreferences: (userPreferences: UserPreferences) => void
  setActiveNamespace: (namespace: string) => void
  excludeSmartCaptureField: (page: string, fieldId: string) => void
  removeExcludedSmartCaptureField: (page: string, fieldId: string) => void
}

export const preferenceStoreConfig = (set, get): UserPreferenceStore => ({
  version: 'unset',
  theme: { themeId: 'xem', mode: 'dark' },
  lastOpenedNotes: {},
  lastUsedSnippets: {},
  space: {},
  addSpacePreference: (spaceId: string, spacePreferenceData: Partial<SpacePreferenceData>) => {
    const existingSpacePreferences = get().space
    set({
      space: {
        ...existingSpacePreferences,
        [spaceId]: {
          ...(existingSpacePreferences[spaceId] ?? {}),
          ...spacePreferenceData
        }
      }
    })
  },
  smartCaptureExcludedFields: {},

  clear: () => {
    set({
      version: 'unset',
      activeNamespace: undefined,
      space: {},
      lastOpenedNotes: {},
      lastUsedSnippets: {},
      smartCaptureExcludedFields: {}
    })
  },

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
  getUserPreferences: () => {
    return {
      lastOpenedNotes: get().lastOpenedNotes,
      smartCaptureExcludedFields: get().smartCaptureExcludedFields,
      version: get().version,
      space: get().space,
      activeNamespace: get().activeNamespace,
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

const customMergeLastOpened = (key: string) => {
  if (key === 'ts') return mergeLastOpened
}

export const mergeLastOpened = (remote, local) => {
  return Math.max(remote.ts, local.ts) === remote.ts ? remote : local
}

export const getLimitedEntries = <T extends object>(entries: Record<string, T>, limit = 20) => {
  return Object.entries(entries)
    .slice(-Math.abs(limit))
    .reduce((prev: Record<string, T>, [key, value]: [string, T]) => {
      return {
        ...prev,
        [key]: value
      }
    }, {})
}

/**
 * Merging user preferences from the remote server with the local preferences
 *
 * The remote user preferences may be lagging as the local preferences
 * have not been saved on exit
 */
export const mergeUserPreferences = (local: UserPreferences, remote: UserPreferences): UserPreferences => {
  // For all lastOpened of remote
  const mergedLastOpenedNotes = merge(remote.lastOpenedNotes, local.lastOpenedNotes ?? {}, {
    customMerge: customMergeLastOpened
  })

  const mergedLastUsedSnippets = merge(remote.lastUsedSnippets, local.lastUsedSnippets, {
    customMerge: customMergeLastOpened
  })

  const mergedSpacePreferences = merge(local.space, remote.space ?? {})
  const theme = remote.theme ?? local.theme

  // mog('mergedLastOpenedNotes', { localLastOpenedNotes, mergedLastOpenedNotes, local, remote })
  return {
    version: local.version,
    // Overwrite all notes with the remote notes which exist
    // The local notes which do not exist in the remote notes will be left alone
    activeNamespace: remote.activeNamespace ?? local.activeNamespace,
    lastOpenedNotes: getLimitedEntries({ ...local.lastOpenedNotes, ...mergedLastOpenedNotes }),
    lastUsedSnippets: { ...local.lastUsedSnippets, ...mergedLastUsedSnippets },
    space: mergedSpacePreferences,
    theme: {
      ...theme,
      themeId: theme.themeId.toLowerCase()
    },
    smartCaptureExcludedFields: local.smartCaptureExcludedFields
  }
}

export const userPreferenceStore = createStore(preferenceStoreConfig, StoreIdentifier.PREFERENCES, true)
