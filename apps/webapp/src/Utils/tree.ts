import { TreeData, TreeItem } from '@atlaskit/tree'
import { ItemId } from '@atlaskit/tree/dist/types/types'

import { Contents, getNameFromPath, getParentNodePath, isElder, isParent, NodeMetadata } from '@mexit/core'
import { LastOpenedState, TreeNode } from '@mexit/shared'

import { useReminderStore } from '../Stores/useReminderStore'
import { useTodoStore } from '../Stores/useTodoStore'

import { filterIncompleteTodos } from './filter'

// * at: numner (Lower -> asc)
export type PriorityNode = { path: string; at: number }

export const sortTree = (tree: TreeNode[], contents: Contents): TreeNode[] => {
  // const metadataList = Object.entries(contents).map(([k, v]) => v.metadata)

  const sorting = (a, b) => {
    const aMeta = contents[a.nodeid] && contents[a.nodeid].metadata ? contents[a.nodeid].metadata : ({} as NodeMetadata)
    const bMeta = contents[b.nodeid] && contents[b.nodeid].metadata ? contents[b.nodeid].metadata : ({} as NodeMetadata)

    if (aMeta.createdAt && bMeta.createdAt) {
      return bMeta.createdAt - aMeta.createdAt
    }
    if (aMeta.createdAt && !bMeta.createdAt) {
      return -1
    }
    if (bMeta.createdAt && !aMeta.createdAt) {
      return 1
    }
    return 0
  }

  const sortedTree = tree.sort((a, b) => sorting(a, b))

  tree.forEach((node) => {
    if (node.children) {
      node.children = sortTree(node.children, contents)
    }
  })

  return sortedTree
}

export const DEFAULT_PRIORITY_NODES = {
  Onboarding: {
    path: 'Onboarding',
    at: 1
  },
  Drafts: {
    path: 'Drafts',
    at: 2
  },
  'Daily Tasks': {
    path: 'Daily Tasks',
    at: 3
  }
}

export const sortTreeWithPriority = (
  tree: BaseTreeNode[],
  priorityNodes: Record<string, PriorityNode> = DEFAULT_PRIORITY_NODES
) => {
  const priorityNodesFromTree = []
  const restBaseTree = []

  tree.forEach((treeNode) => {
    const pNode = priorityNodes[treeNode.path]
    if (pNode) priorityNodesFromTree.push(treeNode)
    else restBaseTree.push(treeNode)
  })

  return [...priorityNodesFromTree.sort((a, b) => priorityNodes[a.path].at - priorityNodes[b.path].at), ...restBaseTree]
}

const createChildLess = (path: string, nodeid: string, id: string, icon?: string, data?: any): TreeItem => ({
  id,
  hasChildren: false,
  isExpanded: false,
  isChildrenLoading: false,
  data,
  children: []
})

// Insert the given node in a nested tree
const insertInNested = (iNode: BaseTreeNode, nestedTree: BaseTreeNode[]) => {
  const currentTree = [...nestedTree]

  currentTree.forEach((n, index) => {
    // * Are Nodes related
    if (isElder(iNode.path, n.path)) {
      let children: BaseTreeNode[]

      // * Is related note is its parent note
      if (iNode.parentNodeId === n.nodeid) {
        children = [...n.children, iNode]
      } else if (!iNode.parentNodeId && isParent(iNode.path, n.path)) {
        children = [...n.children, iNode]
      } else {
        children = insertInNested(iNode, n.children)
      }

      currentTree.splice(index, 1, {
        ...n,
        children
      })
    }
  })

  return currentTree
}

export interface FlatItem {
  id: string
  nodeid: string
  namespace?: string
  parentNodeId?: string
  tasks?: number
  reminders?: number
  lastOpenedState?: LastOpenedState
  icon?: string
  stub?: boolean
}

export const TREE_SEPARATOR = '-'

interface BaseTreeNode {
  path: string
  nodeid: string
  parentNodeId?: string
  children: BaseTreeNode[]
  icon?: string
  tasks?: number
  reminders?: number
  lastOpenedState?: LastOpenedState
}

const getItemFromBaseNestedTree = (
  baseNestedTree: BaseTreeNode[],
  path: string,
  nodeid: string
): BaseTreeNode | undefined => {
  if (!path) {
    return undefined
  }

  for (let i = 0; i < baseNestedTree.length; i++) {
    const node = baseNestedTree[i]
    if (!node) return undefined
    if (node.nodeid === nodeid) {
      return node
    }
    // mog('node', { node, path, baseNestedTree })
    if (isElder(path, node.path)) {
      return getItemFromBaseNestedTree(node.children, path, nodeid)
    }
  }
  return undefined
}

const getIdFromBaseNestedTree = (baseNestedTree: BaseTreeNode[], path: string, nodeid: string): string | undefined => {
  if (!path) {
    return undefined
  }

  for (let i = 0; i < baseNestedTree.length; i++) {
    const node = baseNestedTree[i]
    if (!node) return undefined

    if (node.nodeid === nodeid && node.path === path) {
      return `${i + 1}`
    }
    if (isElder(path, node.path)) {
      return `${i + 1}${TREE_SEPARATOR}${getIdFromBaseNestedTree(node.children, path, nodeid)}`
    }
  }
  return undefined
}

export const sortBaseNestedTree = (baseNestedTree: BaseTreeNode[], metadata: Record<string, NodeMetadata>) => {
  const sorting = (a: BaseTreeNode, b: BaseTreeNode) => {
    const aMeta = metadata[a.nodeid]
    const bMeta = metadata[b.nodeid]
    if (aMeta && aMeta.createdAt && bMeta && bMeta.createdAt) {
      return bMeta.createdAt - aMeta.createdAt
    }
    if (aMeta && aMeta.createdAt && (!bMeta || !bMeta.createdAt)) {
      return -1
    }
    if (bMeta && bMeta.createdAt && (!aMeta || !aMeta.createdAt)) {
      return 1
    }
    return 0
  }
  const sortedTree = baseNestedTree.sort((a, b) => sorting(a, b))

  for (let i = 0; i < sortedTree.length; i++) {
    const node = sortedTree[i]
    if (node.children) {
      node.children = sortBaseNestedTree(node.children, metadata)
      sortedTree[i] = node
    }
  }

  return sortedTree
}

export const getBaseNestedTree = (flatTree: FlatItem[]): BaseTreeNode[] => {
  const todos = useTodoStore.getState().getAllTodos()
  const reminderGroups = useReminderStore.getState().getNodeReminderGroup()

  let baseNestedTree: BaseTreeNode[] = []

  flatTree.forEach((n) => {
    const parentId = getParentNodePath(n.id)
    const tasks = todos[n.nodeid] ? todos[n.nodeid].filter(filterIncompleteTodos).length : 0
    const reminders = reminderGroups[n.nodeid] ? reminderGroups[n.nodeid].length : 0

    const baseTreeNote = {
      path: n.id,
      nodeid: n.nodeid,
      children: [],
      tasks,
      reminders
    }
    if (parentId === null) {
      // add to tree first level
      baseNestedTree.push(baseTreeNote)
    } else {
      // Will have a parent
      const iNode = n.parentNodeId ? { ...baseTreeNote, parentNodeId: n.parentNodeId } : baseTreeNote
      baseNestedTree = insertInNested(iNode, baseNestedTree)
    }
  })

  // mog('baseNestedTree', { baseNestedTree, sortedBaseNestedTree })

  return baseNestedTree
}

// Generate nested node tree from a list of ordered id strings
// Expanded - path of the nodes that are expanded in tree
// Note that id of FlatItem is the path
// And id of TreeItem is the index+1 in nested tree like `1-2-3`
export const generateTree = (
  treeFlat: FlatItem[],
  expanded: string[],
  sort?: (a: BaseTreeNode, b: BaseTreeNode) => number
): TreeData => {
  // tree should be sorted
  // mog('GenerateTree ', { treeFlat })
  const unsortedBaseNestedTree = getBaseNestedTree(treeFlat)
  const baseNestedTree = sort ? unsortedBaseNestedTree.sort(sort) : sortTreeWithPriority(unsortedBaseNestedTree)
  const nestedTree: TreeData = {
    rootId: '1',
    items: {}
  }

  const rootItem = {
    id: '1',
    data: { title: 'root', path: 'root' },
    children: [],
    isExpanded: baseNestedTree.length > 0,
    isChildrenLoading: false,
    hasChildren: baseNestedTree.length > 0
  }

  for (let i = 0; i < treeFlat.length; i++) {
    const n = treeFlat[i]
    const parentPath = getParentNodePath(n.id)
    const nestedItem = getItemFromBaseNestedTree(baseNestedTree, n.id, n.nodeid)

    if (!nestedItem) {
      continue
    }

    if (parentPath === null) {
      // add to tree first level
      const newId = `1${TREE_SEPARATOR}${getIdFromBaseNestedTree(baseNestedTree, n.id, n.nodeid)}`
      // mog('does not Parent Internal', { parentPath, n, newId, i })
      nestedTree.items[newId] = {
        ...createChildLess(n.id, n.nodeid, newId, n.icon, {
          title: getNameFromPath(n.id),
          nodeid: n.nodeid,
          path: n.id,
          mex_icon: n.icon,
          namespace: n.namespace,
          stub: n.stub,
          tasks: nestedItem.tasks,
          reminders: nestedItem.reminders,
          lastOpenedState: nestedItem.lastOpenedState
        }),
        isExpanded: expanded.includes(n.id)
      }
    } else {
      // Will have a parent
      const parent = treeFlat.find((l) => l.id === parentPath)
      const parentNodeId = parent && parent.nodeid
      const parentId = `1${TREE_SEPARATOR}${getIdFromBaseNestedTree(baseNestedTree, parentPath, parentNodeId)}`
      const parentItem = nestedTree.items[parentId]
      // mog('hasParent Internal', { parentId, nestedItem, parentNodeId, parentItem, parentPath, n, i })
      if (parentItem) {
        // add to tree and update parent
        const newId = `1${TREE_SEPARATOR}${getIdFromBaseNestedTree(baseNestedTree, n.id, n.nodeid)}`
        // Order is important for rendering children
        parentItem.children.push(newId)
        parentItem.hasChildren = true
        nestedTree.items[parentId] = parentItem
        nestedTree.items[newId] = {
          ...createChildLess(n.id, n.nodeid, newId, n.icon, {
            title: getNameFromPath(n.id),
            nodeid: n.nodeid,
            path: n.id,
            mex_icon: n.icon,
            namespace: n.namespace,
            stub: n.stub,
            tasks: nestedItem.tasks,
            reminders: nestedItem.reminders,
            lastOpenedState: nestedItem.lastOpenedState
          }),
          isExpanded: expanded.includes(n.id)
        }
      }
    }
  }

  baseNestedTree.forEach((n, i) => {
    rootItem.children.push(`1${TREE_SEPARATOR}${i + 1}`)
  })

  nestedTree.items['1'] = rootItem

  return nestedTree
}

const getFlatTree = (nestedTree: TreeNode[]) => {
  let newTree: TreeNode[] = []

  nestedTree.forEach((c) => {
    newTree.push({ ...c, children: [] })
    if (c.children.length > 0) {
      newTree = newTree.concat(getFlatTree(c.children))
    }
  })

  return newTree
}

export const flattenNestedTreeFromIds = (nestedTree: ItemId[], treeRecord: TreeData['items']) => {
  let newTree = []

  nestedTree.forEach((item) => {
    const treeItem = treeRecord[item]
    if (treeItem) {
      newTree.push(treeItem)
      if (treeItem.children?.length > 0) {
        newTree = newTree.concat(flattenNestedTreeFromIds(treeItem.children, treeRecord))
      }
    }
  })

  return newTree
}

type Value = {
  label: string
  value: string
}

export const getOptions = (flatTree: TreeNode[]): Value[] => {
  return flatTree.map((n) => ({ label: n.id, value: n.id }))
}

export const getNodeFlatTree = (id: string, flatTree: TreeNode[]) => {
  return flatTree.filter((n) => n.id === id)
}

export default getFlatTree
