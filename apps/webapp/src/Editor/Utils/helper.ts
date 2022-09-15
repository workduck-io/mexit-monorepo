import { deepEqual } from 'fast-equals'

import { SEPARATOR } from '@mexit/core'

export const withoutDelimiter = (text: string, delimiter = '.') => {
  const key = text
    .split(delimiter)
    .filter((ch) => ch !== '')
    .join(delimiter)

  if (text?.startsWith(delimiter) && key.length > 0) return { key: `.${key}`, isChild: true }
  return { key, isChild: false }
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
