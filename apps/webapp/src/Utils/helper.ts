import { SEPARATOR } from '@workduck-io/mex-editor'
import React from 'react'
import { NodeProperties } from '../Stores/useEditorStore'

export const BASE_DRAFT_PATH = 'Draft'

export const isElder = (id: string, xparent: string) => {
  return id.startsWith(xparent + SEPARATOR)
}

export const getInitialNode = (): NodeProperties => ({
  title: '@',
  id: '@',
  path: '@',
  nodeid: '__null__'
})

export const getAllParentIds = (id: string) =>
  id.split(SEPARATOR).reduce((p, c) => [...p, p.length > 0 ? `${p[p.length - 1]}${SEPARATOR}${c}` : c], [])

export const getNodeIcon = (path: string) => {
  if (isElder(path, BASE_DRAFT_PATH)) {
    return 'ri:draft-line'
  }
}

export const resize = (ref: React.RefObject<HTMLElement>) => {
  window.parent.postMessage({ type: 'height-init', height: ref.current.clientHeight }, '*')
}
