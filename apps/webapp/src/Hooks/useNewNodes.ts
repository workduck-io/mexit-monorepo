import { toast } from 'react-hot-toast'

import { generateNodeUID, mog } from '@mexit/core'

import { useInternalLinks } from './useInternalLinks'
import { useApi } from './useApi'
import { useDataStore } from '../Stores/useDataStore'
import { useUpdater } from './useUpdater'

export const useNewNodes = () => {
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const { getParentILink, updateSingleILink, updateMultipleILinks, getEntirePathILinks } = useInternalLinks()
  const { saveSingleNewNode, bulkCreateNodes } = useApi()
  const { updateFromContent } = useUpdater()

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
    save?: boolean
  ) => {
    try {
      ilink = checkValidILink({ ilink, parentId, showAlert: false })
      const nodeUID = generateNodeUID()

      const parentILink = getParentILink(ilink)

      if (parentILink && parentILink.nodeid) {
        updateSingleILink(nodeUID, ilink)
      } else {
        const linksToBeCreated = getEntirePathILinks(ilink, nodeUID)
        updateMultipleILinks(linksToBeCreated)
      }

      if (save === false) return

      parentILink && parentILink.nodeid
        ? saveSingleNewNode(nodeUID, ilink, parentILink.nodeid, content)
        : bulkCreateNodes(nodeUID, ilink, content)

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
    save?: boolean
  ) => {
    try {
      ilink = checkValidILink({ ilink, parentId, showAlert: false })
      const nodeUID = generateNodeUID()

      const parentILink = getParentILink(ilink)

      if (parentILink && parentILink.nodeid) {
        updateSingleILink(nodeUID, ilink)
      } else {
        const linksToBeCreated = getEntirePathILinks(ilink, nodeUID)
        updateMultipleILinks(linksToBeCreated)
      }

      if (save === false) return

      const node =
        parentILink && parentILink.nodeid
          ? await saveSingleNewNode(nodeUID, ilink, parentILink.nodeid, content)
          : await bulkCreateNodes(nodeUID, ilink, content)

      updateFromContent(nodeUID, content)

      return node
    } catch (error) {
      mog('Error while creating node', { error, ilink })
      if (showAlert) toast.error('Path clashed with a ReservedKeyword')
    }
  }

  return { addNodeOrNodes, addNodeOrNodesFast }
}
