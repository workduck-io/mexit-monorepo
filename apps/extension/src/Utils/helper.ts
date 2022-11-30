import {
  ActionType,
  convertContentToRawText,
  defaultContent,
  ILink,
  ListItemType,
  MEXIT_FRONTEND_URL_BASE,
  MexitAction,
  NodeContent,
  QuickLinkType,
  Snippet
} from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'

export function getContent(nodeid: string): NodeContent {
  // create a hashmap with id vs content
  // load the content from hashmap

  const { contents } = useContentStore.getState()

  // mog('getContent', { nodeid, contents, nodeidCon: contents[nodeid] })
  if (contents[nodeid]) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // TODO: fix differences between node type of webapp and extension
    return contents[nodeid]
  }
  return defaultContent
}

export const getListItemFromNode = (node: ILink, description?: string, blockid?: string, actionType?: ActionType) => {
  const rawText = description ?? convertContentToRawText(getContent(node?.nodeid)?.content ?? [], ' ')

  const listItem: ListItemType = {
    icon: node?.icon ?? 'gg:file-document',
    title: node?.path,
    id: node?.nodeid,
    description: rawText,
    category: QuickLinkType.backlink,
    type: actionType,
    extras: {
      nodeid: node?.nodeid,
      blockid,
      path: node?.path,
      new: false,
      base_url: `${MEXIT_FRONTEND_URL_BASE}/editor/${node?.nodeid}`
    },
    shortcut: {
      save: {
        category: 'action',
        keystrokes: 'Enter',
        title: actionType === ActionType.OPEN ? 'to Open' : 'to Save'
      }
    }
  }

  return listItem
}

export const getListItemFromAction = (action: MexitAction) => {
  const actionItem: ListItemType = {
    icon: action?.icon ?? 'fluent:arrow-routing-24-filled',
    category: QuickLinkType.action,
    id: action.id,
    type: action.type,
    description: action.description,
    shortcut: {
      search: {
        category: 'action',
        title: 'to Open',
        keystrokes: 'Enter'
      }
    },
    title: action.title,
    extras: {
      combo: true
    }
  }

  return actionItem
}

export const getListItemFromSnippet = (snippet: Snippet, actionType?: ActionType) => {
  const rawText = convertContentToRawText(snippet?.content ?? [], ' ') // Replace this with useDescriptionStore

  const listItem: ListItemType = {
    icon: snippet.icon ?? 'ri:quill-pen-line',
    title: snippet.title,
    id: snippet.id,
    description: rawText,
    category: QuickLinkType.snippet,
    extras: {
      nodeid: snippet.id,
      path: snippet.title,
      base_url: `${MEXIT_FRONTEND_URL_BASE}/snippets/${snippet.id}`
    },
    shortcut: {
      copy: {
        category: 'action',
        keystrokes: 'Enter',
        title: actionType === ActionType.OPEN ? 'to Open' : 'to copy'
      }
      // paste: {
      //   category: 'action',
      //   keystrokes: '$mod+Enter',
      //   title: 'to paste'
      // }
    }
  }

  return listItem
}
