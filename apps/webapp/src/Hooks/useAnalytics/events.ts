export enum CustomEvents {
  LOGGED_IN = 'Logged In',
  LOGGED_OUT = 'Logged Out',
  REGISTER = 'Register',
  FORGOT_PASSWORD = 'Forgot Password',
  SHORTCUT_KEYPRESS = 'KeyPress - Shortcut',
  SHORTCUT_CHANGE = 'Change - Shortcut',
  SYNC_BLOCK_CREATE = 'Create - Flow Link',
  TAG_CREATE = 'Create - Tag',
  REFACTOR = 'Refactored',
  ILINK_CREATE = 'Create - ILink',
  TEMPLATE_CREATE = 'Create - Template',
  INLINE_BLOCK_CREATE = 'Create - Inline Block',
  SEARCH = 'Search',
  MEDIA_EMBED_CREATE = 'Create - Media',
  SNIPPET_USE = 'Use - Snippet',
  SNIPPET_CREATE = 'Create - Snippet',
  ERROR_OCCURED = 'Error',
  INTENT_SAVE = 'Save - Intent',
  SYNC_BLOCK_SYNC = 'Sync - Data'
}

export enum ActionType {
  KEY_PRESS = 'KeyPress',
  CLICK = 'Click',
  USE = 'Use',
  CREATE = 'Create',
  CHANGE = 'Change',
  DELETE = 'Delete',
  SAVE = 'Save',
  SYNC = 'Sync'
}

export enum Properties {
  WORKSPACE_ID = 'mex-workspace-id',
  EMAIL = 'mex-email',
  ROLE = 'mex-role',
  NAME = 'mex-name'
}
