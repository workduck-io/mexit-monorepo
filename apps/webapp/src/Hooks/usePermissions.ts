import { BreadcrumbItem } from '@workduck-io/mex-components'

import { AccessLevel, ILink, SharedNode, NodeType, getParentBreadcurmbs, mog } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import { useNamespaces } from './useNamespaces'

export const usePermissions = () => {
  const { getNamespaceOfNodeid } = useNamespaces()
  /**
   * Access level of the current user for a note
   *
   * Find access of the note
   * Find access of the namespace of the note
   *
   * Which overrides?
   */
  const accessWhenShared = (nodeid: string): AccessLevel => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const res = sharedNodes.find((n) => n.nodeid === nodeid)
    if (res) return res.currentUserAccess
    const namespaceOfNode = getNamespaceOfNodeid(nodeid)
    return undefined
  }

  return { accessWhenShared }
}
