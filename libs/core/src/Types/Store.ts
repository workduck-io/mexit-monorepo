import { AddILinkProps, CachedILink, ILink, InitData, InitDataStoreType, LinkCache, Tag, TagsCache } from './Editor'

export interface DataStoreState {
  tags: Tag[]
  ilinks: ILink[]
  linkCache: LinkCache
  tagsCache: TagsCache
  baseNodeId: string
  bookmarks: string[]
  archive: ILink[]
  publicNodes: Record<string, string>

  initializeDataStore: (initData: InitDataStoreType) => void

  // adds the node
  addILink: (props: AddILinkProps) => ILink | undefined

  // adds tag for combobox
  addTag: (tag: string) => void

  setIlinks: (ilinks: ILink[]) => void
  setBaseNodeId: (baseNodeId: string) => void

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

  setNodePublic: (nodeId: string, publicURL: string) => void
  setNodePrivate: (nodeId: string) => void
  checkNodePublic: (nodeId: string) => string | undefined
}
