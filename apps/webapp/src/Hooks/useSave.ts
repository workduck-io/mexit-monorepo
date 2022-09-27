import { getTodosFromContent, mog } from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { getContent } from '../Stores/useEditorStore'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useTodoStore } from '../Stores/useTodoStore'
import { PersistentData } from '../Types/Data'
import { useApi } from './API/useNodeAPI'
import { useLinks } from './useLinks'
import { useSearch } from './useSearch'
import { useTags } from './useTags'

interface SaveEditorValueOptions {
  // If not set, defaults to true
  saveApi?: boolean

  // Defaults to false
  isShared?: boolean
}

export const useDataSaverFromContent = () => {
  const setContent = useContentStore((state) => state.setContent)
  const getContent = useContentStore((state) => state.getContent)

  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)

  const { updateTagsFromContent } = useTags()
  const { saveDataAPI } = useApi()

  const { updateDocument } = useSearch()

  // By default saves to API use false to not save
  const saveEditorValueAndUpdateStores = async (
    nodeId: string,
    namespace: string,
    editorValue: any[],
    options?: SaveEditorValueOptions
  ) => {
    if (editorValue) {
      setContent(nodeId, editorValue)
      mog('saveEditorValueAndUpdateStores', { nodeId, editorValue, options })

      if (options?.saveApi !== false) await saveDataAPI(nodeId, namespace, editorValue, options?.isShared ?? false)

      updateLinksFromContent(nodeId, editorValue)
      updateTagsFromContent(nodeId, editorValue)

      // Update operations for only notes owned by the user
      if (options?.isShared !== true) {
        updateNodeTodos(nodeId, getTodosFromContent(editorValue))
        updateDocument('node', nodeId, editorValue)
      }
    }
  }

  const saveNodeAPIandFs = (nodeId: string, namespace: string) => {
    const content = getContent(nodeId)
    mog('saving to api for nodeId: ', { nodeId, content })
    saveDataAPI(nodeId, namespace, content.content)
  }

  return { saveEditorValueAndUpdateStores, saveNodeAPIandFs }
}
