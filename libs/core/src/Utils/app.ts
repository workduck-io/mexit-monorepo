import { compare as semverCompare } from 'semver'

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
