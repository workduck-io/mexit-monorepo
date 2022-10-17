import { AccessLevel, ShareContext, SHARED_NAMESPACE } from '@mexit/core'

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
      hasAccess = false
      access['space'] = namespaceOfNode.access
    }

    if (hasAccess) {
      return access
    }
    return undefined
  }

  return { accessWhenShared }
}
