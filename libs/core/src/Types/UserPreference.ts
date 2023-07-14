import { UserThemePreferences } from '@workduck-io/mex-themes'

import { LastOpenedType } from '../Stores'

export enum LastOpenedState {
  UNREAD = 'unread',
  OPENED = 'opened',
  MUTED = 'muted'
}

/**
 * Last opened note details
 */
export interface LastOpenedData {
  /** Number of times opened */
  freq: number

  /** Timestamp when last opened */
  ts: number

  /** Whether the note is muted */
  muted: boolean
}

export type SpacePreference = Record<string, SpacePreferenceData>

export type SpacePreferenceData = {
  hidden?: boolean
}

/**
 * Last opened note mapped to their nodeid
 */
export interface LastOpenedNotes {
  [nodeid: string]: LastOpenedData
}

export interface LastUsedSnippets {
  [snippetid: string]: LastOpenedData
}

export interface UserPreferences {
  lastOpened: LastOpenedType
  version: string
  lastOpenedNotes: LastOpenedNotes
  space: SpacePreference
  lastUsedSnippets: LastUsedSnippets
  /** Current mex Theme */
  theme?: UserThemePreferences
  activeNamespace?: string // * Namespace Id
  smartCaptureExcludedFields?: any
  preferenceModifiedAt?: number
  setpreferenceModifiedAt?: (preferenceModifiedAt: number) => void
}
