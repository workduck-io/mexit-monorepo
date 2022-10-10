import { toast } from 'react-hot-toast'

import { generateNodeUID, mog, SEPARATOR } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useApi } from './API/useNodeAPI'
import { useInternalLinks } from './useInternalLinks'
import { useNamespaces } from './useNamespaces'
import { useUpdater } from './useUpdater'

export const useNewNodes = () => {
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const { getParentILink, updateSingleILink, updateMultipleILinks, getEntirePathILinks } = useInternalLinks()
  const { saveSingleNewNode, bulkCreateNodes } = useApi()
  const { updateFromContent } = useUpdater()
  const { getDefaultNamespace } = useNamespaces()

  /*
    Do not await for the save call and just return directly. This allows updating the ILinks locally
    without having to wait for the response of the API call. Once the API call returns, it updates the ilinks
    and different stores. This is useful in cases such as lookup, where we can create the hierarchy locally
    and close the modal
  */
  const addNodeOrNodesFast = (
    ilink: string,
    showAlert: boolean,
    parentId?: string,
    content?: any[],
    save?: boolean,
    // default namespace if the following not provided
    namespace?: string
  ) => {
    try {
      ilink = checkValidILink({ notePath: ilink, openedNotePath: parentId, showAlert: false })
      const nodeUID = generateNodeUID()
      const isRoot = ilink.split(SEPARATOR).length === 1
      const parentILink = getParentILink(ilink)
      const ns = namespace ?? getDefaultNamespace().id

      if ((parentILink && parentILink?.nodeid) || isRoot) {
        updateSingleILink(nodeUID, ilink, ns)
      } else {
        const linksToBeCreated = getEntirePathILinks(ilink, nodeUID, ns)
        updateMultipleILinks(linksToBeCreated)
      }

      if (save === false) return
      ;(parentILink && parentILink?.nodeid) || isRoot
        ? saveSingleNewNode(nodeUID, ns, { path: ilink, parentNoteId: parentILink?.nodeid, content: content })
        : bulkCreateNodes(nodeUID, ns, {
            path: ilink,
            content: content
          })

      if (content) updateFromContent(nodeUID, content)

      return { id: nodeUID, path: ilink }
    } catch (error) {
      mog('Error while creating node', { error, ilink })
      if (showAlert) toast.error('Path clashed with a ReservedKeyword')
    }
  }

  const addNodeOrNodes = async (
    ilink: string,
    showAlert: boolean,
    parentId?: string,
    content?: any[],
    save?: boolean,
    // default namespace if the following not provided
    namespace?: string
  ) => {
    try {
      ilink = checkValidILink({ notePath: ilink, openedNotePath: parentId, showAlert: false })
      const nodeUID = generateNodeUID()
      const ns = namespace ?? getDefaultNamespace().id
      const parentILink = getParentILink(ilink)
      const isRoot = ilink.split(SEPARATOR).length === 1

      if ((parentILink && parentILink?.nodeid) || isRoot) {
        updateSingleILink(nodeUID, ilink, ns)
      } else {
        const linksToBeCreated = getEntirePathILinks(ilink, nodeUID, ns)
        updateMultipleILinks(linksToBeCreated)
      }

      if (save === false) return

      const node =
        (parentILink && parentILink?.nodeid) || isRoot
          ? await saveSingleNewNode(nodeUID, ns, { path: ilink, parentNoteId: parentILink?.nodeid, content: content })
          : await bulkCreateNodes(nodeUID, ns, {
              path: ilink,
              content: content
            })

      updateFromContent(nodeUID, content)

      return node
    } catch (error) {
      mog('Error while creating node', { error, ilink })
      if (showAlert) toast.error('Path clashed with a ReservedKeyword')
    }
  }

  return { addNodeOrNodes, addNodeOrNodesFast }
}
