import { toast } from 'react-hot-toast'

import { generateNodeUID, mog } from '@mexit/core'

import { useInternalLinks } from '../Data/useInternalLinks'
import { useApi } from './useApi'
import { useDataStore } from '../Stores/useDataStore'

export const useNewNodes = () => {
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const { getParentILink } = useInternalLinks()
  const { saveSingleNewNode, bulkCreateNodes } = useApi()

  const addNodeOrNodes = async (ilink, showAlert, parentId?) => {
    try {
      ilink = checkValidILink({ ilink, parentId, showAlert })
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

  return { addNodeOrNodes }
}
