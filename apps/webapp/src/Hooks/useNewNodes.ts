import { toast } from 'react-hot-toast'

import { generateNodeUID, mog } from '@mexit/core'

import { useInternalLinks } from './useInternalLinks'
import { useApi } from './useApi'
import { useDataStore } from '../Stores/useDataStore'
import { useUpdater } from './useUpdater'

export const useNewNodes = () => {
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const { getParentILink } = useInternalLinks()
  const { saveSingleNewNode, bulkCreateNodes } = useApi()
  const { updateFromContent } = useUpdater()

  const addNodeOrNodes = async (ilink, showAlert, parentId?, content?: any[], save?: boolean) => {
    try {
      ilink = checkValidILink({ ilink, parentId, showAlert: false })
      const nodeUID = generateNodeUID()

      const parentILink = getParentILink(ilink)

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

  return { addNodeOrNodes }
}
