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

export const SNIPPET_VIEW_NAMESPACES: Array<SingleNamespace> = [
  {
    id: 'NAMESPACE_SNIPPETS',
    name: 'Snippets',
    createdAt: 0,
    updatedAt: 0,
    // THIS SHOULD NOT BE USED
    access: 'OWNER',
    icon: DefaultMIcons.SNIPPET
  },
  {
    id: 'NAMESPACE_TEMPLATES',
    name: 'Templates',
    createdAt: 0,
    updatedAt: 0,
    // THIS SHOULD NOT BE USED
    access: 'OWNER',
    icon: DefaultMIcons.TEMPLATE
  },
  {
    id: 'NAMESPACE_PROMPT',
    name: 'Prompts',
    createdAt: 0,
    updatedAt: 0,
    // THIS SHOULD NOT BE USED
    access: 'OWNER',
    icon: DefaultMIcons.PROMPT
  }
]

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
