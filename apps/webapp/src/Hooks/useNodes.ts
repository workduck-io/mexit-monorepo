import { toast } from 'react-hot-toast'

import useDataStore from '../Stores/useDataStore'
import { AddILinkProps, ILink } from '../Types/Data'

import { mog } from '@mexit/shared'

// Used to ensure no path clashes while adding ILink.
// path functions to check wether clash is happening can be also used
export const useNodes = () => {
  const addILink = useDataStore((s) => s.addILink)

  const addNode = (props: AddILinkProps, onSuccess: (node: ILink) => void, showAlert = true) => {
    // mog('Adding Node for:', { props })
    try {
      const node = addILink({ ...props, showAlert })
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
  return { addNode, isInArchive, getIcon, getNode, getArchiveNode }
}
