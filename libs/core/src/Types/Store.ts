import {
  AddILinkProps,
  CheckValidILinkProps,
  CachedILink,
  ILink,
  InitData,
  InitDataStoreType,
  LinkCache,
  SlashCommands,
  Tag,
  TagsCache,
  SharedNode
} from './Editor'

export interface DataStoreState {
  tags: Tag[]
  ilinks: ILink[]
  linkCache: LinkCache
  tagsCache: TagsCache
  baseNodeId: string
  bookmarks: string[]
  archive: ILink[]
  publicNodes: any[]
  sharedNodes: SharedNode[]
  slashCommands: SlashCommands

  initializeDataStore: (initData: InitDataStoreType) => void

  // Just to reset everything to initial data
  resetDataStore: () => void

  // adds the node
  addILink: (props: AddILinkProps) => ILink | undefined

  // adds tag for combobox
  addTag: (tag: string) => void
  setTags: (tags: Tag[]) => void

  setIlinks: (ilinks: ILink[]) => void
  setBaseNodeId: (baseNodeId: string) => void

  setSlashCommands: (slashCommands: SlashCommands) => void

  // Bookmarks
  addBookmarks: (bookmarks: string[]) => void
  removeBookamarks: (bookmarks: string[]) => void
  setBookmarks: (bookmarks: string[]) => void
  getBookmarks: () => string[]

  // Tags Cache
  updateTagCache: (tag: string, nodes: string[]) => void
  updateTagsCache: (tagsCache: TagsCache) => void

  // Internal Links Cache
  // adds the link between nodes
  addInternalLink: (ilink: CachedILink, nodeid: string) => void
  removeInternalLink: (ilink: CachedILink, nodeid: string) => void
  updateInternalLinksForNode: (links: CachedILink[], nodeid: string) => void
  updateInternalLinks: (linkCache: LinkCache) => void

  addInArchive: (archive: ILink[]) => void
  unArchive: (archive: ILink) => void
  removeFromArchive: (archive: ILink[]) => void
  setArchive: (archive: ILink[]) => void

  setNodePublic: (nodeId: string) => void
  setNodePrivate: (nodeId: string) => void
  checkNodePublic: (nodeId: string) => boolean

  checkValidILink: (props: CheckValidILinkProps) => string

  // Shared Nodes
  setSharedNodes: (sharedNodes: SharedNode[]) => void
  getSharedNodes: () => SharedNode[]

  setPublicNodes: (publicNodes: any[]) => void
}
