import HighlightSource from 'web-highlighter/dist/model/source'

import { ElementHighlightMetadata } from './Highlight'
import { AccessLevel } from './Mentions'
import { MIcon } from './Store'

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
  icon?: MIcon | undefined

  elementMetadata: ElementHighlightMetadata
  publicAccess?: boolean
  iconUrl?: string
  // The snippet ID with which all the children nodes should be populated
  templateID?: string
  title?: string
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

  namespace: string

  /** Iconify Icon string */
  icon?: MIcon

  createdAt?: number
  updatedAt?: number

  parentNodeId?: string
}

type UserID = string
export interface SharedNode extends ILink {
  currentUserAccess: AccessLevel
  sharedBy: UserID
  owner: UserID
}

export type NewILinkProps = {
  openedNotePath?: string
  content?: NodeEditorContent
  showAlert?: boolean
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
  namespace: string
  nodeid?: string
  openedNodePath?: string
  archived?: boolean
  showAlert?: boolean
}

export interface CheckValidILinkProps {
  notePath: string
  openedNotePath?: string
  showAlert?: boolean
  namespace?: string
}

export interface NodeProperties {
  title: string
  id: string
  nodeid: string
  path: string
  namespace: string
}

export enum QuickLinkType {
  backlink = 'Backlinks',
  publicNotes = 'Public Notes',
  snippet = 'Snippets',
  tags = 'Tags',
  action = 'Actions',
  mentions = 'Mentions',
  taskView = 'Task View',
  search = 'Search',
  prompts = 'Prompts',
  webLinks = 'Links'
}

export enum QuickLinkStatus {
  new,
  exists
}

export enum ComboboxKey {
  TAG = 'tag',
  MENTION = 'mention',
  INTERNAL = 'internal',
  INLINE_BLOCK = 'inline_block',
  SLASH_COMMAND = 'slash_command',
  BLOCK = 'block'
}

export enum CategoryType {
  backlink = 'Backlinks',
  action = 'Quick Actions',
  search = 'Search Results',
  task = 'Task',
  tag = 'Tags'
}

export interface SlashCommand {
  command: string
  text?: string
  icon?: MIcon
  type?: QuickLinkType | CategoryType
  /** Extended command -> Text after the command is part of it and used as arguments */
  extended?: boolean
}

export interface SlashCommands {
  default: SlashCommand[]
  internal: SlashCommand[]
}

export enum NodeType {
  DEFAULT,
  PUBLIC,
  SHARED,
  ARCHIVED,
  MISSING
}
