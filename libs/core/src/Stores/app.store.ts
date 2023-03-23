import { compare as semverCompare } from 'semver'

import { FeatureFlags, FeatureFlagsType } from '../Types/FeatureFlags'
import { StoreIdentifier } from '../Types/Store'
import { IS_DEV } from '../Utils/config'
import { createStore } from '../Utils/storeCreator'

const defaultFeatureFlags: FeatureFlagsType = {
  [FeatureFlags.PRESENTATION]: IS_DEV,
  [FeatureFlags.ACTIONS]: false
}

export const appStoreConfig = (set, get) => ({
  featureFlags: defaultFeatureFlags,
  setFeatureFlags: (featureFlags: FeatureFlagsType) => {
    set({
      featureFlags
    })
  },
  version: undefined as string,
  setVersion: (version: string) => {
    set({ version: version })
  },
  clear: () =>
    set({
      manualReload: false
    }),
  manualReload: false,
  setManualReload: (manualReload: boolean) => set({ manualReload })
})

export const useAppStore = createStore(appStoreConfig, StoreIdentifier.APP, true, {
  storage: {
    web: localStorage
  }
})

/**
 * Compares version strings using semver
 * @param {string} persistedVersion - The current version persisted in the store
 * @param {string} targetVersion - The version to compare the persistedVersion against. Fetched from package.json
 * @returns {number} Returns the following:
 *      -1 if targetVersion > persistedVersion
 *      0 if targetVersion === persistedVersion
 *      1 if targetVersion < persistedVersion
 */

export const compareVersions = (persistedVersion: string, targetVersion: string) => {
  return semverCompare(persistedVersion, targetVersion)
}
