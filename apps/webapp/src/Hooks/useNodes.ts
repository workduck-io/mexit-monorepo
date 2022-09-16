import { BreadcrumbItem } from '@workduck-io/mex-components'

import { AccessLevel, ILink, SharedNode, NodeType, getParentBreadcurmbs } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'

// Used to ensure no path clashes while adding ILink.
// path functions to check wether clash is happening can be also used
export const useNodes = () => {
  const isInArchive = (nodeid: string): boolean => {
    const archive = useDataStore.getState().archive
    const res = archive.map((l) => l.nodeid).includes(nodeid)
    return res
  }

  const getIcon = (nodeid: string): string => {
    const nodes = useDataStore.getState().ilinks
    const node = nodes.find((l) => l.nodeid === nodeid)
    if (node) return node.icon
  }

  const getNode = (nodeid: string, shared = false): ILink => {
    const nodes = useDataStore.getState().ilinks
    const node = nodes.find((l) => l.nodeid === nodeid)

    if (node) return node
    if (shared) {
      const sNodes = useDataStore.getState().sharedNodes
      const sNode = sNodes.find((l) => l.nodeid === nodeid)
      if (sNode) return sNode
    }
  }
  const getArchiveNode = (nodeid: string): ILink => {
    const nodes = useDataStore.getState().archive
    const node = nodes.find((l) => l.nodeid === nodeid)
    if (node) return node
  }
  const getSharedNode = (nodeid: string): SharedNode => {
    const nodes = useDataStore.getState().sharedNodes
    const node = nodes.find((l) => l.nodeid === nodeid)
    if (node) return node
  }
  const isSharedNode = (nodeid: string): boolean => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const res = sharedNodes.map((l) => l.nodeid).includes(nodeid)
    return res
  }

  const accessWhenShared = (nodeid: string): AccessLevel => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const res = sharedNodes.find((n) => n.nodeid === nodeid)
    if (res) return res.currentUserAccess
    return undefined
  }

  const getNodeType = (nodeid: string) => {
    if (getNode(nodeid)) return NodeType.DEFAULT
    if (isInArchive(nodeid)) return NodeType.ARCHIVED
    if (isSharedNode(nodeid)) return NodeType.SHARED
    return NodeType.MISSING
  }

  const getNodeBreadcrumbs = (nodeid: string): BreadcrumbItem[] => {
    const nodes = useDataStore.getState().ilinks
    const node = nodes.find((l) => l.nodeid === nodeid)

    if (node) {
      const parents = getParentBreadcurmbs(node.path, nodes)

      parents.unshift({
        id: 'space-personal',
        icon: 'ri:user-line',
        label: 'Personal',
        hideLabel: true
      })

      // mog('We have them breadcrumbs', { parents, nodeid, allParents })
      return parents
    }

    const sharedNodes = useDataStore.getState().sharedNodes
    const sharedNode = sharedNodes.find((n) => n.nodeid === nodeid)
    if (sharedNode) {
      const parents = getParentBreadcurmbs(sharedNode.path, sharedNodes)

      parents.unshift({
        id: 'space-shared',
        icon: 'ri:share-line',
        label: 'Shared Notes',
        hideLabel: true
      })

      return parents
    }

    return []
  }

  return {
    isInArchive,
    getIcon,
    getNode,
    getArchiveNode,
    getSharedNode,
    isSharedNode,
    accessWhenShared,
    getNodeType,
    getNodeBreadcrumbs
  }
}
