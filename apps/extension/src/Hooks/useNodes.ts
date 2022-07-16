import { toast } from 'react-hot-toast'

import { AccessLevel, AddILinkProps, ILink, mog, NodeType, SharedNode } from '@mexit/core'
import useDataStore from '../Stores/useDataStore'

// Used to ensure no path clashes while adding ILink.
// path functions to check wether clash is happening can be also used
export const useNodes = () => {
  const addILink = useDataStore((s) => s.addILink)

  const addNode = (props: AddILinkProps, onSuccess: (node: ILink) => void, showAlert = true) => {
    // mog('Adding Node for:', { props })
    try {
      const node = addILink({ ...props, showAlert })
      console.log('New ILink: ', node)
      if (node) onSuccess(node)
    } catch (e) {
      mog('Error while creating node', { e })
      if (showAlert) toast.error('Path clashed with a ReservedKeyword')
    }
  }

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

  const getNode = (nodeid: string): ILink => {
    const nodes = useDataStore.getState().ilinks
    const node = nodes.find((l) => l.nodeid === nodeid)
    if (node) return node
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
  return {
    addNode,
    isInArchive,
    getIcon,
    getNode,
    getArchiveNode,
    getSharedNode,
    isSharedNode,
    accessWhenShared,
    getNodeType
  }
}
