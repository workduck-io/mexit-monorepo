import { ILink, Tag, NodeContent, LinkCache, TagsCache, TodosType, Snippet } from '@mexit/core'
import { Reminder } from './Reminders'

export interface PersistentData {
  baseNodeId: string
  ilinks: ILink[]
  tags: Tag[]
  contents: {
    [key: string]: NodeContent
  }

  linkCache: LinkCache
  tagsCache: TagsCache

  archive: ILink[]
  bookmarks: string[]

  todos: TodosType
  reminders: Reminder[]
  snippets: Snippet[]
}
