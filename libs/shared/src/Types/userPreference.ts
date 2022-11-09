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
  version: string
  lastOpenedNotes: LastOpenedNotes
  lastUsedSnippets: LastUsedSnippets
  /** Current mex Theme */
  theme?: string
  activeNamespace?: string // * Namespace Id
  smartCaptureExcludedFields?: any
}
