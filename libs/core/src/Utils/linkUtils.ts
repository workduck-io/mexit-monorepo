import { Link } from '../Stores/linkStoreConstructor'
import { ActionType } from '../Types/Actions'
import { QuickLinkType } from '../Types/Editor'
import { ListItemType } from '../Types/List'
import { fuzzySearch } from './fuzzysearch'
import { LINK_SHORTENER_URL_BASE } from './routes'

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

export const getListItemFromLink = (link: Link, workspaceID: string) => {
  const actionItem: ListItemType = {
    icon: 'ri:link-m',
    title: link?.title,
    id: link?.url,
    description: link?.alias,
    category: QuickLinkType.action,
    type: ActionType.OPEN,
    extras: {
      base_url: `${LINK_SHORTENER_URL_BASE}/${workspaceID}/${link?.alias}`
    },
    shortcut: {
      open: {
        category: 'action',
        keystrokes: 'Enter',
        title: 'to Open'
      },
      copy: {
        category: 'action',
        keystrokes: '$mod+Enter',
        title: 'to copy'
      }
    }
  }

  return actionItem
}

// * Get Favicon url
export const getFavicon = (source: string) => {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${source}&SIZE=64`
}
