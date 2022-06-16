import { toast } from 'react-hot-toast'

import { AddILinkProps, generateNodeUID, ILink, mog } from '@mexit/core'
import { useDataStore } from '../Stores/useDataStore'
import { useInternalLinks } from '../Data/useInternalLinks'
import { useApi } from './useApi'

// Used to ensure no path clashes while adding ILink.
// path functions to check wether clash is happening can be also used
export const useNodes = () => {
  const addILink = useDataStore((s) => s.addILink)
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const { getParentILink } = useInternalLinks()
  const { saveSingleNewNode, bulkCreateNodes } = useApi()

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

  const addNodeOrNodes = async (ilink, showAlert) => {
    try {
      checkValidILink(ilink, true)
      const nodeUID = generateNodeUID()

      const parentILink = getParentILink(ilink)

      const node =
        parentILink && parentILink.nodeid
          ? await saveSingleNewNode(nodeUID, ilink, parentILink.nodeid)
          : await bulkCreateNodes(nodeUID, ilink)

      return node
    } catch (error) {
      mog('Error while creating node', { error, ilink })
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
  return { addNode, addNodeOrNodes, isInArchive, getIcon, getNode, getArchiveNode }
}
