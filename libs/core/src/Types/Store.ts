import {
  AddILinkProps,
  CachedILink,
  CheckValidILinkProps,
  ILink,
  InitDataStoreType,
  LinkCache,
  SharedNode,
  SlashCommands,
  Tag,
  TagsCache
} from './Editor'
import { AccessLevel } from './Mentions'

export const iconTypes = ['URL', 'ICON', 'EMOJI'] as const
// M stands for Multi/Mex/Many (yet to decide)
export interface MIcon {
  type: typeof iconTypes[number]
  value: string
}

export const getMIcon = (type: MIcon['type'], value: MIcon['value']) => {
  return {
    type,
    value
  }
}

export const DefaultMIcons = {
  NOTE: getMIcon('ICON', 'gg:file-document'),
  SNIPPET: getMIcon('ICON', 'ri:quill-pen-line'),
  SHARED_NOTE: getMIcon('ICON', 'ri:share-line'),
  VIEW: getMIcon('ICON', 'ri:stack-line')
}

export interface SingleNamespace {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  // Manage for owner if granterId is absent
  access: AccessLevel

  icon?: MIcon

  publicAccess?: boolean
  granterID?: string
}

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
  namespaces: SingleNamespace[]

  initializeDataStore: (initData: InitDataStoreType) => void

  // Just to reset everything to initial data
  resetDataStore: () => void

  // Namespaces
  setNamespaces: (namespaces: SingleNamespace[]) => void
  addNamespace: (namespace: SingleNamespace) => void
  updateNamespace: (namespace: SingleNamespace) => void

  // adds the node
  addILink: (props: AddILinkProps) => ILink | undefined

  // adds tag for combobox
  addTag: (tag: string) => void
  setTags: (tags: Tag[]) => void

  setIlinks: (ilinks: ILink[]) => void
  updateILinkIcon: (nodeId: string, icon: MIcon) => void
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

  _hasHydrated: boolean
  setHasHydrated: (state) => void
}
