import { getTodosFromContent, NodeEditorContent } from '@mexit/core'
import { useContentStore } from '../Stores/useContentStore'
import { useTodoStore } from '../Stores/useTodoStore'
import { useLinks } from './useLinks'
import { useSearch } from './useSearch'
import { useTags } from './useTags'

export const useUpdater = () => {
  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)
  const setContent = useContentStore((store) => store.setContent)
  const { updateTagsFromContent } = useTags()
  const { updateDocument } = useSearch()

  const updateFromContent = async (noteId: string, content: NodeEditorContent) => {
    if (content) {
      setContent(noteId, content)
      updateLinksFromContent(noteId, content)
      updateTagsFromContent(noteId, content)
      updateNodeTodos(noteId, getTodosFromContent(content))

      await updateDocument('node', noteId, content)
    }
  }

  return {
    updateFromContent
  }
}
