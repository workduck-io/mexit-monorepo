import { NodeProperties } from '../Types/Editor'
import { BASE_DRAFT_PATH, BASE_TASKS_PATH } from './defaults'
import { SEPARATOR } from './idGenerator'

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

export const DefaultNodeIcon = 'ri:file-list-2-line'

export const getParentId = (id: string, separator = SEPARATOR) => {
  const lastIndex = id.lastIndexOf(separator)
  if (lastIndex === -1) return null
  return id.slice(0, lastIndex)
}

/** Also includes the ID of the final node */
/**
    id = a.b.c
    link = [a b c]
    a, a.b, a.b.c
  */
export const getAllParentPaths = (
  id: string, // const allParents: string[] = []
  separator = SEPARATOR
) =>
  id
    .split(separator) // split by `.`
    .reduce(
      // Use prefix of last element when the array has elements
      (p, c) => [...p, p.length > 0 ? `${p[p.length - 1]}${separator}${c}` : c],
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

export const getParentFromPath = (id: string) => {
  const split = id.split(SEPARATOR)
  if (split.length > 1) {
    split.pop()
    return split.join(SEPARATOR)
  }
  return undefined
}

export const getNameFromPath = (id: string) => {
  const split = id.split(SEPARATOR)
  if (split.length > 1) return split[split.length - 1]
  return id
}
// export default generateTree(sampleFlatTree)
