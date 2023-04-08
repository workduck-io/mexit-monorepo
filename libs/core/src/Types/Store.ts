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

export const iconTypes = ['URL', 'ICON', 'EMOJI', 'MEX'] as const
// M stands for Multi/Mex/Many (yet to decide)
export interface MIcon {
  type: (typeof iconTypes)[number]
  value: string
}

export const getMIcon = (type: MIcon['type'], value?: MIcon['value']) => {
  return {
    type,
    value
  }
}

export enum StoreIdentifier {
  CONTENTS = 'contents',
  RECENTS = 'recents',
  SNIPPETS = 'snippets',
  ACTIONS = 'actions',
  TASKS = 'tasks',
  DATA = 'data',
  DESCRIPTIONS = 'description',
  HIGHLIGHTS = 'highlight',
  LINKS = 'link',
  VIEW = 'view',
  MENTIONS = 'mention',
  METADATA = 'metadata',
  PREFERENCES = 'preference',
  PROMPRTS = 'prompt',
  REACTIONS = 'reaction',
  REMINDERS = 'reminder',
  REQUESTCACHE = 'request-cache',
  SHORTCUTS = 'shortcut',
  SMARTCAPTURE = 'smart-capture',
  API = 'api',
  AUTH = 'auth',
  BLOCK = 'block',
  FLOATING = 'floating',
  COMMENTS = 'comments',
  HELP = 'help',
  HISTORY = 'history',
  LAYOUT = 'layout',
  MODAL = 'modal',
  PORTAL = 'portal',
  PUBLICNODES = 'public-nodes',
  REFACTOR = 'refactor',
  RENAME = 'rename',
  ROUTE = 'route-store',
  SHAREMODAL = 'share-modal',
  TREE = 'tree',
  USERCACHE = 'user-cache',
  APP = 'app',
  EDITORS = 'editors',
  EDITOR = 'editor',
  BUFFER = 'buffer',
  BLOCKHIGHLIGHT = 'block-highlight',
  SPUTLIT = 'sputlit',
  COMBOBOX = 'combobox',
  TODO = 'todo',
  INIT = 'init'
}

export const getStoreName = (key: StoreIdentifier, isExtension?: boolean) => {
  return `mexit-${key}-${isExtension ? 'extension' : 'webapp'}`
}

export const DefaultMIcons = {
  NOTE: getMIcon('ICON', 'gg:file-document'),
  SNIPPET: getMIcon('ICON', 'ri:quill-pen-line'),
  SHARED_NOTE: getMIcon('ICON', 'mex:shared-note'),
  VIEW: getMIcon('ICON', 'ri:stack-line'),
  TAG: getMIcon('ICON', 'ri:hashtag'),
  TEMPLATE: getMIcon('ICON', 'ri:magic-line'),
  DELETE: getMIcon('ICON', 'ri:delete-bin-5-line'),
  PROMPT: getMIcon('ICON', 'material-symbols:charger-outline')
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
  sharedNodes: SharedNode[]
  slashCommands: SlashCommands
  spaces: SingleNamespace[]
  namespaces: SingleNamespace[]

  initializeDataStore: (initData: InitDataStoreType) => void

  // Just to reset everything to initial data
  resetDataStore: () => void

  // Namespaces
  setNamespaces: (namespaces: SingleNamespace[]) => void
  addNamespace: (namespace: SingleNamespace) => void
  updateNamespace: (namespace: SingleNamespace) => void
  deleteNamespace: (namespceId: string, clearSpace?: boolean) => void

  // adds the node
  addILink: (props: AddILinkProps) => ILink | undefined

  addSpace: (space: SingleNamespace) => void
  setAllSpaces: (spaces: SingleNamespace[]) => void

  // adds tag for combobox
  addTag: (tag: string) => void
  setTags: (tags: Tag[]) => void

  setIlinks: (ilinks: ILink[]) => void
  updateNamespaceOfILinks: (namespace: string, nodeLinks: ILink[]) => void
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

  checkValidILink: (props: CheckValidILinkProps) => string

  // Shared Nodes
  setSharedNodes: (sharedNodes: SharedNode[]) => void
  getSharedNodes: () => SharedNode[]
}

export const setStoreValue =
  <T>(
    set: (fn: (draft: T & { actionType?: string; noDiff?: boolean }) => void) => void,
    storeKey: keyof T,
    actionType: string,
    merge?: boolean
  ) =>
  (value?: any) => {
    set((state) => {
      state.noDiff = true
      if (state[storeKey] !== value) {
        state.noDiff = false
        state.actionType = actionType
        if (!merge) {
          state[storeKey] = value
        } else {
          state[storeKey] = { ...state[storeKey], ...value }
        }
      }
    })
  }
