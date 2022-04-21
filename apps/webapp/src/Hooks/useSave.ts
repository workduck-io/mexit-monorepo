import { NodeEditorContent, mog } from '@mexit/core'

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

import { writeToIndexedDB } from '../Data/persistentStorage'
import { PersistentData } from '../Types/Data'

export const useDataSaverFromContent = () => {
  const setContent = useContentStore((state) => state.setContent)
  // const getContent = useContentStore((state) => state.getContent)

  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)

  const { updateTagsFromContent } = useTags()
  const { saveDataAPI } = useApi()

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
      reminders: useReminderStore.getState().reminders,
    }
    mog('We persisted the data for you', { persistentData })
    writeToIndexedDB(persistentData)
  }


  return { saveEditorValueAndUpdateStores, saveDataToPersistentStorage }
}


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
