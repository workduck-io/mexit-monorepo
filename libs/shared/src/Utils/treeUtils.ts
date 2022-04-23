import { TreeNode } from '../Types/Tree'
import { BASE_DRAFT_PATH, SEPARATOR, BASE_TASKS_PATH } from '@mexit/core'
import { NodeProperties } from '@mexit/core'

export const sampleFlatTree = [
  '@',
  'docs',
  'dev',
  'dev.big',
  'dev.big.small',
  'dev.git',
  'dev.js',
  'pro',
  'pro.mex',
  'pro.mex.issues',
  'com',
  'com.workduck'
]

export const getInitialNode = (): NodeProperties => ({
  title: '@',
  id: '@',
  path: '@',
  nodeid: '__null__'
})

export const getNodeIcon = (path: string) => {
  if (isElder(path, BASE_DRAFT_PATH)) {
    return 'ri:draft-line'
  }
  if (isElder(path, BASE_TASKS_PATH)) {
    return 'ri:task-line'
  }
}

export const getParentId = (id: string) => {
  const lastIndex = id.lastIndexOf(SEPARATOR)
  if (lastIndex === -1) return null
  return id.slice(0, lastIndex)
}

/** Also includes the ID of the final node */
/**
    id = a.b.c
    link = [a b c]
    a, a.b, a.b.c
  */
export const getAllParentIds = (
  id: string // const allParents: string[] = []
) =>
  id
    .split(SEPARATOR) // split by `.`
    .reduce(
      // Use prefix of last element when the array has elements
      (p, c) => [...p, p.length > 0 ? `${p[p.length - 1]}${SEPARATOR}${c}` : c],
      []
    )

//
// let past = ''
// id.split(SEPARATOR).forEach((s) => {
//   const link = past === '' ? s : `${past}${SEPARATOR}${s}`
//   allParents.push(link)
//   past = link
// })
// return allParents

export const isElder = (id: string, xparent: string) => {
  return id.startsWith(xparent + SEPARATOR)
}

export const isParent = (id: string, parent: string) => {
  return getParentId(id) === parent
}

export const isTopNode = (id: string) => {
  return getParentId(id) === null
}

export const getNodeIdLast = (id: string) => {
  const split = id.split(SEPARATOR)
  if (split.length > 1) return split[split.length - 1]
  return id
}

const createChildLess = (n: string, nodeid: string, icon?: string): TreeNode => ({
  id: n,
  title: getNodeIdLast(n),
  key: n,
  nodeid,
  mex_icon: icon,
  children: []
})

// Insert the given node in a nested tree
const insertInNested = (iNode: TreeNode, nestedTree: TreeNode[]) => {
  const newNested = [...nestedTree]

  newNested.forEach((n) => {
    const index = newNested.indexOf(n)
    if (index > -1) {
      if (isElder(iNode.id, n.id)) {
        let children: TreeNode[]
        if (isParent(iNode.id, n.id)) {
          children = [...n.children, iNode]
        } else {
          children = insertInNested(iNode, n.children)
        }
        // console.log({ children });
        newNested.splice(index, 1, {
          ...n,
          children
        })
      }
    }
  })

  return newNested
}

// Generate nested node tree from a list of ordered id strings
export const generateTree = (tree: { id: string; nodeid: string; icon?: string }[]) => {
  // tree should be sorted
  let nestedTree: TreeNode[] = []
  tree.forEach((n) => {
    const parentId = getParentId(n.id)
    if (parentId === null) {
      // add to tree first level
      nestedTree.push(createChildLess(n.id, n.nodeid, n.icon))
    } else {
      // Will have a parent
      nestedTree = insertInNested(createChildLess(n.id, n.nodeid, n.icon), nestedTree)
    }
  })
  return nestedTree
}

export const getFlatTree = (nestedTree: TreeNode[]) => {
  let newTree: TreeNode[] = []

  nestedTree.forEach((c) => {
    newTree.push({ ...c, children: [] })
    if (c.children.length > 0) {
      newTree = newTree.concat(getFlatTree(c.children))
    }
  })

  return newTree
}
