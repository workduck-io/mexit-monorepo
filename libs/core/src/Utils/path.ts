import { toast } from 'react-hot-toast'

import { BreadcrumbItem } from '@workduck-io/mex-components'

import { ILink } from '../Types/Editor'
import { DefaultMIcons, SingleNamespace } from '../Types/Store'

import { BASE_DRAFT_PATH, BASE_TASKS_PATH } from './defaults'
import { SEPARATOR, SnippetCommandPrefix } from './idGenerator'
import { mog } from './mog'
import { getNameFromPath } from './treeUtils'

const RESERVED_PATHS: string[] = [BASE_DRAFT_PATH, BASE_TASKS_PATH, 'mex', SnippetCommandPrefix, 'sync', 'root']

export const RESERVED_NAMESPACES = {
  default: 'Personal',
  shared: 'Shared'
}

export const SHARED_NAMESPACE: SingleNamespace = {
  id: 'NAMESPACE_shared',
  name: RESERVED_NAMESPACES.shared,
  createdAt: 0,
  updatedAt: 0,
  // THIS SHOULD NOT BE USED
  access: 'OWNER',
  icon: { type: 'ICON', value: 'mex:shared-note' }
}

export enum RESERVED_SNIPPET_SPACES {
  snippets = 'snippets',
  templates = 'templates',
  prompts = 'prompts'
}

export enum RESERVED_CAPTURES_SPACES {
  captures = 'captures',
  links = 'links'
}

export const SNIPPET_VIEW_NAMESPACES: Array<SingleNamespace> = [
  {
    id: RESERVED_SNIPPET_SPACES.snippets,
    name: 'Snippets',
    createdAt: 0,
    updatedAt: 0,
    // THIS SHOULD NOT BE USED
    access: 'OWNER',
    icon: DefaultMIcons.SNIPPET
  },
  {
    id: RESERVED_SNIPPET_SPACES.templates,
    name: 'Templates',
    createdAt: 0,
    updatedAt: 0,
    // THIS SHOULD NOT BE USED
    access: 'OWNER',
    icon: DefaultMIcons.TEMPLATE
  },
  {
    id: RESERVED_SNIPPET_SPACES.prompts,
    name: 'Prompts',
    createdAt: 0,
    updatedAt: 0,
    // THIS SHOULD NOT BE USED
    access: 'OWNER',
    icon: DefaultMIcons.PROMPT
  }
]

export const CAPTURES_VIEW_NAMESPACES: Array<SingleNamespace> = [
  {
    id: RESERVED_CAPTURES_SPACES.captures,
    name: 'Captures',
    createdAt: 0,
    updatedAt: 0,
    access: 'OWNER',
    icon: DefaultMIcons.CAPTURES
  },
  {
    id: RESERVED_CAPTURES_SPACES.links,
    name: 'Links',
    createdAt: 0,
    updatedAt: 0,
    access: 'OWNER',
    icon: DefaultMIcons.HIGHLIGHT
  }
]

export const isReservedNamespace = (name: string) => {
  if (!name) return false

  return name === RESERVED_NAMESPACES.default || name === RESERVED_NAMESPACES.shared
}

export const getNewNamespaceName = (num: number): string => {
  return `Space ${num}`
}

export const getPathNum = (path: string) => {
  const numMatch = path.match(/\d+$/)
  // mog('getPathNum', { path, numMatch })
  if (numMatch) {
    const prevPathNum = path.match(/\d+$/)[0]
    return `${path.slice(0, path.length - prevPathNum.length)}${Number(prevPathNum) + 1}`
  } else {
    return `${path}-1`
  }
}

export const isReserved = (path: string) =>
  RESERVED_PATHS.reduce((p, c) => {
    if (c.toLowerCase() === path.toLowerCase()) {
      return true
    } else return p || false
  }, false)

export const isClash = (path: string, paths: string[]) => paths.includes(path)

export const getUniquePath = (path: string, paths: string[], showNotification = true): { unique: string } | false => {
  // Is path reserved
  if (isReserved(path)) {
    return false
  }

  // Is path is already present (Clash)
  if (paths.includes(path)) {
    let newPath = getPathNum(path)
    while (paths.includes(newPath)) {
      newPath = getPathNum(newPath)
    }
    mog('Paths', { paths, newPath, isReserved })
    if (showNotification) toast('Path clashed with existing, incremented a numeric suffix')
    return { unique: newPath }
  }

  return { unique: path }
}

/*
 * Checks if a path is same or a child of given testPath
 */
export const isMatch = (path: string, testPath: string) => {
  if (testPath === path) return true
  if (path.startsWith(testPath + SEPARATOR)) return true
  return false
}

export const isReservedOrClash = (path: string, paths: string[]) => {
  return isReserved(path) || isClash(path, paths)
}

export const createEntityPath = (type: 'view', id: string, parentPath?: string, SEPARATOR = '|') => {
  if (!id) return `${type}${SEPARATOR}`

  return `${parentPath ?? `${type}${SEPARATOR}`}${id}${SEPARATOR}`
}

export const getAllParentIds = (id: string) =>
  id
    ?.split(SEPARATOR)
    ?.reduce((p, c) => [...p, p.length > 0 ? `${p[p.length - 1]}${SEPARATOR}${c}` : c], [] as Array<string>)

export const getParentBreadcrumbs = (node: { path: string; namespace?: string }, nodes: ILink[]) => {
  const allParents = getAllParentIds(node.path)

  const parents: BreadcrumbItem[] = allParents.reduce((val, p) => {
    const parentNode = nodes.find((l) => l.path === p && (node.namespace ? node.namespace === l.namespace : true))
    if (parentNode) {
      return [
        ...val,
        {
          id: parentNode.nodeid,
          icon: parentNode.icon ?? 'ri:file-list-2-line',
          label: getNameFromPath(parentNode.path)
        }
      ]
    }
    return val
  }, [])

  return parents
}

// * Entities

export const getAllEntities = (path: string, SEPARATOR = '|') => {
  if (!path) return []

  return path.split(SEPARATOR).filter((e, i) => e && i !== 0)
}

/**
 *
 * @param path Starts with entity type and ends with a separator
 * For example, 'view|Task_dgGd2|'
 *  type = view, Separator = '|'
 * @param SEPARATOR
 * @returns
 */
export const getParentEntity = (path: string, SEPARATOR = '|'): { type: string; parent: string } | undefined => {
  if (!path) return undefined

  const entries = path.split(SEPARATOR)

  if (entries.length >= 3) {
    const type = entries[0]
    const parent = entries.at(-2)

    return {
      type,
      parent
    }
  }

  return undefined
}
