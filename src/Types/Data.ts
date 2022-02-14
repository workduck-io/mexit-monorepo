export interface BlockIndexData {
  blockUID: string
  nodeUID: string
  text: string
}

export interface Metadata {
  createdBy: string
  createdAt: number
  lastEditedBy: string
  updatedAt: number
}
export interface Block {
  id: string // Block ID of form `BLOCK_`
  nodeUID: string // UID of node to which this block belongs
  children: any[]
  metadata?: Metadata // Block level metadata
  type?: string
}

export interface Node {
  id: string
  content: Block[]
  metadata?: Metadata // Node level metadata
}

export type NodeEditorContent = any[]

export interface NodeContent {
  type: string
  content: NodeEditorContent
  version?: number
  metadata?: Metadata
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
