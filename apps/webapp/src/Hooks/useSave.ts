import { mog } from '@mexit/core'

import { useApi } from './useApi'
import { useLinks } from './useLinks'
import { useTags } from './useTags'
import useContentStore from '../Stores/useContentStore'
import useTodoStore from '../Stores/useTodoStore'
import { getTodosFromContent } from '../Utils/content'
import { useReminderStore } from '../Stores/useReminderStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
// import useThemeStore from '../Stores/useThemeStore'
import useDataStore from '../Stores/useDataStore'

import { PersistentData } from '../Types/Data'
import { useIndexedDBData } from './usePersistentData'
import { getContent } from '../Stores/useEditorStore'

export const useDataSaverFromContent = () => {
  const setContent = useContentStore((state) => state.setContent)
  // const getContent = useContentStore((state) => state.getContent)

  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)

  const { updateTagsFromContent } = useTags()
  const { saveDataAPI } = useApi()

  const { persistData } = useIndexedDBData()

  // const { updateDocument } = useSearch()

  // By default saves to API use false to not save
  const saveEditorValueAndUpdateStores = async (nodeId: string, editorValue: any[], saveApi?: boolean) => {
    if (editorValue) {
      setContent(nodeId, editorValue)
      mog('saveEditorValueAndUpdateStores', { nodeId, editorValue, saveApi })

      if (saveApi !== false) saveDataAPI(nodeId, editorValue)
      updateLinksFromContent(nodeId, editorValue)
      updateTagsFromContent(nodeId, editorValue)
      updateNodeTodos(nodeId, getTodosFromContent(editorValue))

      // await updateDocument('node', nodeId, editorValue)
    }
  }

  const saveNodeAPIandFs = (nodeId: string) => {
    const content = getContent(nodeId)
    mog('saving to api for nodeId: ', { nodeId, content })
    saveDataAPI(nodeId, content.content)
    // saveData()
  }

  const saveDataToPersistentStorage = () => {
    const { baseNodeId, ilinks, linkCache, tags, tagsCache, archive, bookmarks } = useDataStore.getState()

    const persistentData: PersistentData = {
      baseNodeId,
      ilinks,
      contents: useContentStore.getState().contents,
      snippets: useSnippetStore.getState().snippets,
      tags,
      linkCache,
      tagsCache,
      archive,
      bookmarks,
      todos: useTodoStore.getState().todos,
      reminders: useReminderStore.getState().reminders
    }
    mog('We persisted the data for you', { persistentData })
    persistData(persistentData)
  }

  return { saveEditorValueAndUpdateStores, saveNodeAPIandFs, saveDataToPersistentStorage }
}
