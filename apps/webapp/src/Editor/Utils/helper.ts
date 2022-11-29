import { NODE_ID_PREFIX, SNIPPET_PREFIX } from '@mexit/core'
import { deepEqual } from 'fast-equals'

export const withoutDelimiter = (text: string, delimiter = '.') => {
  const key = text
    .split(delimiter)
    .filter((ch) => ch !== '')
    .join(delimiter)

  if (text?.startsWith(delimiter) && key.length > 0) return { key: `.${key}`, isChild: true }
  return { key, isChild: false }
}

export const getNodeIdFromEditor = (editorId: string) => {
  /*
   * Find substring of form NODE_{} in editorid
   */
  const nodeReg = new RegExp(`${NODE_ID_PREFIX}_[A-Za-z0-9]+`)
  const nodeIdReg = editorId.match(nodeReg)
  // mog('nodeId', { nodeIdReg, editorId })
  if (nodeIdReg) {
    return nodeIdReg[0]
  }

  const snippetReg = new RegExp(`${SNIPPET_PREFIX}_[A-Za-z0-9]+`)
  const snippetnodeidReg = editorId.match(snippetReg)
  // mog('nodeId', { snippetReg, snippetnodeidReg })
  if (snippetnodeidReg) {
    return snippetnodeidReg[0]
  }
}

export const removeNulls = (obj: any): any => {
  if (obj === null) {
    return undefined
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = removeNulls(obj[key])
    }
  }
  return obj
}

export const removeLink = <T>(item: T, list: T[]): T[] => {
  return list.filter((l) => !deepEqual(l, item))
}

export const typeInvert = (type: string) => (type === 'from' ? 'to' : 'from')

// * Returns an array of unique values via Set
export const Settify = <T>(arr: T[]): T[] => Array.from(new Set(arr))
