import { BreadcrumbItem } from '@workduck-io/mex-components'

import { getParentBreadcrumbs, ILink, mog, NodeType, SharedNode } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useMetadataStore } from '../Stores/useMetadataStore'
import { usePublicNodeStore } from '../Stores/usePublicNodes'
import { useRecentsStore } from '../Stores/useRecentsStore'

// Used to ensure no path clashes while adding ILink.
// path functions to check wether clash is happening can be also used
export const useNodes = () => {
  const setBaseNodeId = useDataStore((store) => store.setBaseNodeId)

  const isInArchive = (nodeid: string): boolean => {
    const archive = useDataStore.getState().archive
    const res = archive.map((l) => l.nodeid).includes(nodeid)
    return res
  }

  const getIcon = (nodeid: string): string => {
    const nodes = useDataStore.getState().ilinks
    const node = nodes.find((l) => l.nodeid === nodeid)
    if (node) return node.icon.value
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

  const isPublicNode = (nodeid: string) => {
    const noteMetadata = useMetadataStore.getState().metadata.notes[nodeid]
    if (noteMetadata?.publicAccess) {
      return true
    }

    const publicNodes = usePublicNodeStore.getState().iLinks
    const nodePublic = publicNodes.find((item) => item.nodeid === nodeid) ? true : false

    return nodePublic
  }

  const getNodeType = (nodeid: string) => {
    if (getNode(nodeid)) return NodeType.DEFAULT
    if (isInArchive(nodeid)) return NodeType.ARCHIVED
    if (isSharedNode(nodeid)) return NodeType.SHARED
    if (isPublicNode(nodeid)) return NodeType.PUBLIC
    return NodeType.MISSING
  }

  const updateBaseNode = (): ILink => {
    const nodeILinks = useDataStore.getState().ilinks
    const baseNodePath = useDataStore.getState().baseNodeId
    const localBaseNode = nodeILinks.find((l) => l.path === baseNodePath)

    if (!localBaseNode) {
      const lastOpenedNodeId = useRecentsStore.getState().lastOpened?.at(0)
      if (lastOpenedNodeId) {
        const node = getNode(lastOpenedNodeId)

        if (node) {
          mog(`Setting Recent Node ${node.path}: ${node.nodeid}`)

          setBaseNodeId(node?.nodeid)
          return node
        }
      }

      if (!lastOpenedNodeId) {
        const topNode = nodeILinks.at(0)

        if (topNode) {
          mog(`Setting Base Node to first Node of hierarchy ${topNode.path}: ${topNode.nodeid}`)
          setBaseNodeId(topNode?.nodeid)
          return topNode
        }
      }
    }

    return localBaseNode
  }

  const getNodeBreadcrumbs = (nodeid: string): BreadcrumbItem[] => {
    const nodes = useDataStore.getState().ilinks
    const node = nodes.find((l) => l.nodeid === nodeid)

    if (node) {
      const parents = getParentBreadcrumbs({ path: node.path, namespace: node.namespace }, nodes)

      // parents.unshift({
      //   id: 'space-personal',
      //   icon: 'ri:user-line',
      //   label: 'Personal',
      //   hideLabel: true
      // })

      // mog('We have them breadcrumbs', { parents, nodeid, allParents })
      return parents
    }

    const sharedNodes = useDataStore.getState().sharedNodes
    const sharedNode = sharedNodes.find((n) => n.nodeid === nodeid)
    if (sharedNode) {
      const parents = getParentBreadcrumbs({ path: sharedNode.path }, sharedNodes)

      // parents.unshift({
      //   id: 'space-shared',
      //   icon: 'ri:share-line',
      //   label: 'Shared Notes',
      //   hideLabel: true
      // })

      return parents
    }

    return []
  }

  return {
    isInArchive,
    isPublicNode,
    getIcon,
    getNode,
    getArchiveNode,
    getSharedNode,
    isSharedNode,
    getNodeType,
    updateBaseNode,
    getNodeBreadcrumbs
  }
}
