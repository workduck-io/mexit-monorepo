import { compare as semverCompare } from 'semver'
import create from 'zustand'
import { persist } from 'zustand/middleware'

import { FeatureFlags, FeatureFlagsType } from '../Types/FeatureFlags'
import { IS_DEV } from '../Utils/config'

interface AppStoreType {
  featureFlags: FeatureFlagsType
  setFeatureFlags: (featureFlags: FeatureFlagsType) => void
  version?: string
  setVersion: (version: string) => void
}

const defaultFeatureFlags: FeatureFlagsType = {
  [FeatureFlags.PRESENTATION]: IS_DEV,
  [FeatureFlags.ACTIONS]: false
}

export const useAppStore = create<AppStoreType>(
  persist(
    (set, get) => ({
      featureFlags: defaultFeatureFlags,
      setFeatureFlags: (featureFlags: FeatureFlagsType) => {
        set({
          featureFlags
        })
      },
      version: undefined,
      setVersion: (version: string) => {
        set({ version: version })
      }
    }),
    {
      name: 'mexit-version-webapp',
      partialize: (store) => ({
        version: store.version
      })
    }
  )
)

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
