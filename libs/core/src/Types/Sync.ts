export enum BroadcastSyncedChannel {
  CONTENTS = 'contents',
  RECENTS = 'recents',
  SNIPPETS = 'snippets',
  ACTIONS = 'actions',
  TASKS = 'tasks',
  DATA = 'data',
  AUTH = 'auth',
  LINKS = 'links',
  DWINDLE = 'dwindle',
  EDITOR = 'editor',
  MENTIONS = 'mentions',
  REMINDERS = 'reminders',
  THEME = 'theme',
  SMART_CAPTURE = 'smart-capture',
  TOKEN_DATA = 'token-data',
  USER_PROPERTIES = 'user-properties',
  EDITOR_BUFFER = 'editor-buffer',
  MULTIPLE_EDITORS = 'multiple-editors',
  DESCRIPTIONS = 'descriptions',
  USER_PREFERENCES = 'user-preferences',
  ROUTES_INFO = 'routes-information',
  HIGHLIGHTS = 'highlights',
  LAYOUT = 'layout',
  TEST_BROADCASTING = 'test-broadcasting'
}

export enum SharedStoreKey {
  ilinks = 'share-ilinks',
  namespaces = 'share-namespaces',
  archive = 'share-archive',
  mentions = 'share-mentions',
  contents = 'share-content',
  auth = 'share-auth',
  forgottenPassword = 'share-forgottenPassword',
  register = 'share-registered',
  userDetails = 'share-userDetails',
  workspaceDetails = 'share-workspaceDetails',
  snippets = 'share-snippets',
  reminders = 'share-reminders',
  publicNodes = 'share-publicNodes',
  highlights = 'share-highlights',
  highlightBlockMap = 'share-highlight-block-map',
  theme = 'share-theme'
}

export type SyncField<Field> = {
  field: Field
  atomicField?: string
}

export type PartialSyncStateType = {
  state: any
  atomicField?: string
}

export type SyncMessageType = {
  updatedAt: number
  state: PartialSyncStateType
  init?: boolean
}
