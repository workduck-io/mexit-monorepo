import { QuickLinkType } from '../Types/Editor'
import { ListItemType } from '../Types/List'
import { fuzzySearch } from './fuzzysearch'

export interface Link {
  url: string
  title: string

  /**
   * If the link is shortend it has an alias
   */
  alias?: string
  tags?: string[]

  createdAt?: number
  updatedAt?: number
}

export const fuzzySearchLinks = (searchTerm: string, links: Link[]): Link[] => {
  const getKeys = (link: Link) => {
    const keys = [link.title, link.url]
    if (link.alias) {
      keys.push(link.alias)
    }
    return keys
  }
  const newItems = fuzzySearch(links, searchTerm, getKeys)
  // mog('newItems', { newItems })
  return newItems
}

export const sortByCreated = (a: Link, b: Link) => {
  return b.createdAt - a.createdAt
}

export const getListItemFromLink = (link: Link) => {
  const actionItem: ListItemType = {
    icon: 'ri:link-m',
    title: link?.title,
    id: link?.url,
    description: link?.alias,
    category: QuickLinkType.action,
    shortcut: {
      copy: {
        category: 'action',
        keystrokes: 'Enter',
        title: 'to copy'
      }
    }
  }

  return actionItem
}
