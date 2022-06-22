import HighlightSource from 'web-highlighter/dist/model/source'

export interface Content {
  id: string
  highlighterId: string
  content: NodeEditorContent
  metaData?: NodeMetadata
}

export interface Contents {
  [key: string]: NodeContent
}

export enum CaptureType {
  LINK = 'LINK',
  DRAFT = 'DRAFT',
  HIERARCHY = 'HIERARCHY'
}

export interface BlockIndexData {
  blockUID: string
  nodeUID: string
  text: string
}

export interface NodeMetadata {
  createdBy: string
  createdAt: number
  lastEditedBy: string
  updatedAt: number

  highlighterId?: string
  saveableRange?: Partial<HighlightSource>
  sourceUrl?: string
}

export interface Block {
  id: string // Block ID of form `BLOCK_`
  nodeUID: string // UID of node to which this block belongs
  children: any[]
  metadata?: NodeMetadata // Block level metadata
  type?: string
}

export interface Node {
  id: string
  content: Block[]
  metadata?: NodeMetadata // Node level metadata
}

export interface NodeContent {
  type: string
  content: NodeEditorContent
  version?: number
  metadata?: NodeMetadata
}

export interface InitData extends InitDataStoreType {
  contents: Record<string, NodeContent>
}

export interface InitDataStoreType {
  tags: Tag[]
  ilinks: ILink[]
  linkCache: LinkCache
  tagsCache: TagsCache
  bookmarks: string[]
  archive: ILink[]
  baseNodeId: string
}

export type LinkCache = Record<string, CachedILink[]>
export type TagsCache = Record<string, CacheTag>

export interface CachedILink {
  // ILink from/to path
  type: 'from' | 'to'
  nodeid: string
}

export interface CacheTag {
  nodes: string[]
}

export interface ILink {
  /** Unique Identifier */
  nodeid: string

  /** The title of the node.
   * Uses separator for heirarchy */
  path: string

  /** Iconify Icon string */
  icon?: string
}

/**  Tags */
export interface Tag {
  value: string
}

export interface FlexSearchResult {
  blockUID: string
  nodeUID: string
  text: string
  matchField: string[]
}

export interface Content {
  id: string
  highlighterId: string
  content: NodeEditorContent
  range: Partial<HighlightSource>
}

export interface BlockIndexData {
  blockUID: string
  nodeUID: string
  text: string
}

export interface NodeMetadata {
  createdBy: string
  createdAt: number
  lastEditedBy: string
  updatedAt: number
}

export type NodeEditorContent = any[]

export interface NodeContent {
  type: string
  content: NodeEditorContent
  version?: number
  metadata?: NodeMetadata
}

export interface FlexSearchResult {
  blockUID: string
  nodeUID: string
  text: string
  matchField: string[]
}

export interface NodeLink {
  from: string
  to: string
}

export interface AddILinkProps {
  ilink: string
  nodeid?: string
  parentId?: string
  archived?: boolean
  showAlert?: boolean
}

export interface CheckValidILinkProps {
  ilink: string
  parentId?: string
  showAlert?: boolean
}

export interface NodeProperties {
  title: string
  id: string
  nodeid: string
  path: string
}

export enum QuickLinkType {
  backlink = 'Backlinks',
  snippet = 'Snippets',
  tags = 'Tags',
  action = 'Actions'
}

export enum ComboboxKey {
  TAG = 'tag',
  INTERNAL = 'internal',
  INLINE_BLOCK = 'inline_block',
  SLASH_COMMAND = 'slash_command',
  BLOCK = 'block'
}

export enum CategoryType {
  backlink = 'Backlinks',
  action = 'Quick Actions',
  search = 'Search Results',
  task = 'Task'
}

export interface SlashCommand {
  command: string
  text?: string
  icon?: string
  type?: QuickLinkType | CategoryType
  /** Extended command -> Text after the command is part of it and used as arguments */
  extended?: boolean
}

export interface SlashCommands {
  default: SlashCommand[]
  internal: SlashCommand[]
}

export enum QuickLinkStatus {
  new,
  exists
}
