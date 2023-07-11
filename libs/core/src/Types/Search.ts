import { Document } from '@workduck-io/flexsearch'
import { Indexes } from '@workduck-io/mex-search'

import { Link } from '../Stores/link.store'
import { Snippets } from '../Stores/snippet.store'

import { ILink, LinkCache, NodeContent, SharedNode, Tag, TagsCache } from './Editor'
import { Highlights } from './Highlight'
import { PromptDataType } from './Prompt'
import { Reminder } from './Reminders'
import { TodosType } from './Todo'

export interface PersistentData {
  baseNodeId: string
  ilinks: ILink[]
  tags: Tag[]
  contents: {
    [key: string]: NodeContent
  }

  links?: Link[]

  linkCache: LinkCache
  tagsCache: TagsCache

  highlights?: Highlights

  archive: ILink[]
  bookmarks: string[]

  prompts: Array<PromptDataType>

  todos: TodosType
  reminders: Reminder[]
  snippets: Snippets
  sharedNodes: SharedNode[]
}
export interface GenericSearchData {
  id: string
  blockId?: string
  title?: string
  text: string
  data?: any
  tag?: string[]
}

export interface MoveBlocksType {
  indexKey?: Indexes
  fromNodeId: string
  toNodeId: string
  blockIds: string[]
}

export interface SearchIndex {
  node: Document<GenericSearchData> | null
  snippet: Document<GenericSearchData> | null
  archive: Document<GenericSearchData> | null
  template: Document<GenericSearchData> | null
  shared: Document<GenericSearchData> | null
  prompt: Document<GenericSearchData> | null
}

export interface GenericSearchResult {
  id: string
  blockId?: string
  title?: string
  text?: string
  data?: any
  matchField?: string[]
  tag?: string[]
}

/** Search Replacements Extra
 * For blocks with types that match the keys, they are replaced with text given by the replacement value
 */
export interface SearchRepExtra {
  /** Type of the block
   And a key value pair of what to replace at that id
   */
  [type: string]: {
    /** The key of the block used to index replacements */
    keyToIndex: string
    /** replacements for the block text that is keyed by keyToIndex */
    replacements: Record<string, string>
  }
}

export type idxKey = keyof SearchIndex

export interface SearchWorker {
  init: (fileData: PersistentData, indexData: Record<idxKey, any>) => Promise<void>
  addDoc: (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string,
    tags?: Array<string>,
    extra?: SearchRepExtra
  ) => void
  updateDoc: (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string,
    tags?: Array<string>,
    extra?: SearchRepExtra
  ) => void
  removeDoc: (key: idxKey, id: string) => void
  searchIndex: (key: idxKey | idxKey[], query: string, tags: Array<string>) => Promise<GenericSearchResult[]>
  searchIndexByNodeId: (key: idxKey | idxKey[], nodeId: string, query: string) => GenericSearchResult[]
  // dumpIndexDisk: (location: string) => Promise<void>
  searchIndexWithRanking: (
    key: idxKey | idxKey[],
    query: string,
    tags?: Array<string>
  ) => Promise<GenericSearchResult[]>
  getInitState: () => boolean
}
