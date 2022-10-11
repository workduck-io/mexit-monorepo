import { AccessLevel } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useNamespaces } from './useNamespaces'

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
  const accessWhenShared = (nodeid: string): AccessLevel => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const res = sharedNodes.find((n) => n.nodeid === nodeid)
    if (res) return res.currentUserAccess

    const namespaceOfNode = getNamespaceOfNodeid(nodeid)
    if (namespaceOfNode) return namespaceOfNode.access

    return undefined
  }

  return { accessWhenShared }
}
