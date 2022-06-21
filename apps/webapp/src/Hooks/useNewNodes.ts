import { toast } from 'react-hot-toast'

import { generateNodeUID, getTodosFromContent, mog } from '@mexit/core'

import { useInternalLinks } from './useInternalLinks'
import { useApi } from './useApi'
import { useDataStore } from '../Stores/useDataStore'
import { useTodoStore } from '../Stores/useTodoStore'
import { useLinks } from './useLinks'
import { useTags } from './useTags'
import { useSearch } from './useSearch'

export const useNewNodes = () => {
  const checkValidILink = useDataStore((s) => s.checkValidILink)
  const { getParentILink } = useInternalLinks()
  const { saveSingleNewNode, bulkCreateNodes } = useApi()

  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)

  const { updateTagsFromContent } = useTags()
  const { updateDocument } = useSearch()

  const addNodeOrNodes = async (ilink, showAlert, parentId?, content?: any[], save?: boolean) => {
    try {
      ilink = checkValidILink({ ilink, parentId, showAlert })
      const nodeUID = generateNodeUID()

      const parentILink = getParentILink(ilink)

      if (save === false) return

      const node =
        parentILink && parentILink.nodeid
          ? await saveSingleNewNode(nodeUID, ilink, parentILink.nodeid, content)
          : await bulkCreateNodes(nodeUID, ilink, content)

      if (content) {
        updateLinksFromContent(nodeUID, content)
        updateTagsFromContent(nodeUID, content)
        updateNodeTodos(nodeUID, getTodosFromContent(content))

        await updateDocument('node', nodeUID, content)
      }

      return node
    } catch (error) {
      mog('Error while creating node', { error, ilink })
      if (showAlert) toast.error('Path clashed with a ReservedKeyword')
    }
  }

  return { addNodeOrNodes }
}
