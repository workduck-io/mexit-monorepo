import { toast } from 'react-hot-toast'
import { BASE_DRAFT_PATH, BASE_TASKS_PATH } from './defaults'
import { mog } from '@mexit/core'

const RESERVED_PATHS: string[] = [BASE_DRAFT_PATH, BASE_TASKS_PATH, 'mex', 'sync', 'root']

export const getPathNum = (path: string) => {
  const numMatch = path.match(/\d+$/)
  // mog('getPathNum', { path, numMatch })
  if (numMatch) {
    // @ts-ignore
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
