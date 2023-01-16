export enum CustomElements {
  ILINK = 'ilink',
  TAG = 'tag',
  SLASH_COMMAND = 'slash_command'
}

export enum CategoryType {
  backlink = 'Backlinks',
  action = 'Quick Actions',
  search = 'Search Results',
  task = 'Task',
  tag = 'Tags'
}

export enum QuickLinkType {
  backlink = 'Backlinks',
  snippet = 'Snippets',
  tags = 'Tags',
  mentions = 'Mentions',
  taskView = 'Task View',
  prompts = 'Prompts',
  webLinks = 'Links'
}

export enum SlashType {
  embed = 'media_embed',
  table = 'table',
  canvas = 'excalidraw',
  remind = 'remind'
}

export enum KEYBOARD_KEYS {
  Enter = 'Enter',
  ArrowUp = 'ArrowUp',
  ArrowDown = 'ArrowDown',
  Escape = 'Escape',
  Space = 'Space'
}

export const SnippetCommandPrefix = `snip`
export const CreateNewPrefix = `Create `
