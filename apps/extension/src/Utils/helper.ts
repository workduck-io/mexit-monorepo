import {
  ILink,
  convertContentToRawText,
  QuickLinkType,
  CategoryType,
  Snippet,
  defaultContent,
  NodeContent,
  ActionType,
  MexitAction,
  NODE_ID_PREFIX,
  SNIPPET_PREFIX
} from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'
import { ListItemType } from '../Types/List'

export function getContent(nodeid: string): NodeContent {
  // create a hashmap with id vs content
  // load the content from hashmap

  const { contents } = useContentStore.getState()

  // mog('getContent', { nodeid, contents, nodeidCon: contents[nodeid] })
  if (contents[nodeid]) {
    // @ts-ignore
    // TODO: fix differences between node type of webapp and extension
    return contents[nodeid]
  }
  return defaultContent
}

export const getListItemFromNode = (node: ILink, description?: string, blockid?: string) => {
  const rawText = description ?? convertContentToRawText(getContent(node?.nodeid)?.content ?? [], ' ')

  const listItem: ListItemType = {
    icon: node?.icon ?? 'gg:file-document',
    title: node?.path,
    id: node?.nodeid,
    description: rawText,
    category: QuickLinkType.backlink,
    extras: {
      nodeid: node?.nodeid,
      blockid,
      path: node?.path,
      new: false
    },
    shortcut: {
      edit: {
        category: 'action',
        keystrokes: 'Enter',
        title: 'to Edit'
      },
      save: {
        category: 'action',
        keystrokes: '$mod+Enter',
        title: 'to save'
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

export const getListItemFromSnippet = (snippet: Snippet) => {
  const rawText = convertContentToRawText(snippet?.content ?? [], ' ')
  const listItem: ListItemType = {
    icon: snippet.icon ?? 'ri:quill-pen-line',
    title: snippet.title,
    id: snippet.id,
    description: rawText,
    category: QuickLinkType.snippet,
    extras: {
      nodeid: snippet.id,
      path: snippet.title
    },
    shortcut: {
      copy: {
        category: 'action',
        keystrokes: 'Enter',
        title: 'to copy'
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
