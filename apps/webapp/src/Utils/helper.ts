import { NODE_ID_PREFIX, ID_SEPARATOR, SEPARATOR } from '@workduck-io/mex-editor'
import { nanoid } from 'nanoid'

export const BASE_DRAFT_PATH = 'Draft'

export const isElder = (id: string, xparent: string) => {
  return id.startsWith(xparent + SEPARATOR)
}

export const getAllParentIds = (id: string) =>
  id.split(SEPARATOR).reduce((p, c) => [...p, p.length > 0 ? `${p[p.length - 1]}${SEPARATOR}${c}` : c], [])

export const getNodeIcon = (path: string) => {
  if (isElder(path, BASE_DRAFT_PATH)) {
    return 'ri:draft-line'
  }
}

export const generateNodeId = () => `${NODE_ID_PREFIX}${ID_SEPARATOR}${nanoid()}`
