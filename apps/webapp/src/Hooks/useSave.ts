import { useApi } from './useApi'
import { useLinks } from './useLinks'
import { useTags } from './useTags'
import useContentStore from '../Stores/useContentStore'
import { NodeEditorContent } from '@mexit/core'

const useDataSaver = () => {
  const setContent = useContentStore((state) => state.setContent)
  const getContent = useContentStore((state) => state.getContent)
  const { updateLinksFromContent, getPathFromNodeid } = useLinks()
  const { updateTagsFromContent } = useTags()
  const { saveDataAPI } = useApi()

  const saveNodeWithValue = (nodeid: string, editorValue: NodeEditorContent) => {
    if (editorValue) {
      setContent(nodeid, editorValue)
      saveDataAPI(nodeid, editorValue)
      updateLinksFromContent(nodeid, editorValue)
      updateTagsFromContent(nodeid, editorValue)
    }
  }

  return { saveNodeWithValue }
}

export default useDataSaver
