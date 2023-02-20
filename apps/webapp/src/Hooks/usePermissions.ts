import { AccessLevel, AccessLevelPrority, ShareContext, SHARED_NAMESPACE } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'

import { useNamespaces } from './useNamespaces'

type NodeAccess = {
  [context in ShareContext]?: AccessLevel
}

export const usePermissions = () => {
  const { getNamespaceOfNodeid } = useNamespaces()
  /**
   * Access level of the current user for a note
   *
   * Find access of the note
   * Find access of the namespace of the note
   *
   * Note access overrides namespace access
   */
  const accessWhenShared = (nodeid: string): NodeAccess | undefined => {
    const access = {
      note: undefined,
      space: undefined
    } as NodeAccess
    let hasAccess = false
    const sharedNodes = useDataStore.getState().sharedNodes
    const res = sharedNodes.find((n) => n.nodeid === nodeid)

    if (res) {
      hasAccess = true
      access['note'] = res.currentUserAccess
    }

    const namespaceOfNode = getNamespaceOfNodeid(nodeid)
    if (namespaceOfNode && namespaceOfNode.id !== SHARED_NAMESPACE.id) {
      hasAccess = true
      access['space'] = namespaceOfNode.access
    }

    if (hasAccess) {
      return access
    }

    return undefined
  }

  return { accessWhenShared }
}

export const getUserAccess = (user, context, nodeId, namespaceId) => {
  const isContextNote = context === 'note'

  const noteAccess = user?.access?.note?.[nodeId]
  const noteAccessFromSpace = user?.access?.space?.[namespaceId]

  if (!isContextNote) return noteAccessFromSpace

  return compareAccessLevel(noteAccess, noteAccessFromSpace)
}

export const isReadonly = (access: NodeAccess | undefined) => {
  if (!access) return true
  const accessLevel = compareAccessLevel(access.note, access.space)
  return accessLevel === 'READ'
}

export const compareAccessLevel = (node: AccessLevel, space: AccessLevel): AccessLevel => {
  if (!space) return node

  if (AccessLevelPrority[node] > AccessLevelPrority[space]) return node
  return space
}
