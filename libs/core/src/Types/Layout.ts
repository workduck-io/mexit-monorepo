export enum DrawerType {
  ADD_TO_NOTE = 'ADD TO NOTE',
  LINKED_NOTES = 'LINKED NOTES',
  LOADING = 'LOADING'
}

export type Drawer = {
  type: DrawerType
  data?: any
}

export interface FocusMode {
  on: boolean
  hover: boolean
}

export enum ContextMenuType {
  NOTES_TREE = 'NOTES_TREE',
  NOTE_PLUS_BUTTON = 'NOTE_PLUS_BUTTON',
  ARCHIVE_TREE = 'ARCHIVE_TREE',
  SNIPPETS_LIST = 'SNIPPETS_LIST',
  PROMPTS_LIST = 'PROMPTS_LIST',
  NOTE_NAMESPACE = 'NOTE_NAMESPACE',
  VIEW_LIST = 'VIEW_LIST',
  EDITOR = 'EDITOR'
}

export type ContextMenu = {
  item: any
  type: ContextMenuType
  coords: { x: number; y: number }
}

export enum ModalsType {
  blocks,
  delete,
  deleteSpace,
  refactor,
  lookup,
  rename,
  releases,
  reminders,
  share,
  help,
  todo,
  template,
  manageSpaces,
  quickNew,
  previewNote
}
