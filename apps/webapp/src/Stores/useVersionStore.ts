import semverCompare from 'semver/functions/compare'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface VersionStoreState {
  version?: string
  setVersion: (version: string) => void
}

export const useVersionStore = create<VersionStoreState>(
  persist(
    (set, get) => ({
      setVersion: (version: string) => {
        set({ version: version })
      }
    }),
    {
      name: 'mexit-version-webapp'
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
