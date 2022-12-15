import { getTodosFromContent, NodeEditorContent } from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'

import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useMetadataStore } from '../Stores/useMetadataStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { useTodoStore } from '../Stores/useTodoStore'

import { useLinks } from './useLinks'
import { useSearch } from './useSearch'
import { useTags } from './useTags'

export const useUpdater = () => {
  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)
  const setContent = useContentStore((store) => store.setContent)
  const addMetadata = useMetadataStore((store) => store.addMetadata)
  const { updateTagsFromContent } = useTags()
  const { updateDocument } = useSearch()

  const { generateSlashCommands } = useSlashCommands()
  const setSlashCommands = useDataStore((store) => store.setSlashCommands)

  const updater = () => {
    const slashCommands = generateSlashCommands(useSnippetStore.getState().snippets)

    setSlashCommands(slashCommands)
  }

  const updateFromContent = async (noteId: string, content: NodeEditorContent, metadata?: any) => {
    if (content) {
      setContent(noteId, content)
      if (metadata) addMetadata('notes', { [noteId]: metadata })
      updateLinksFromContent(noteId, content)
      updateTagsFromContent(noteId, content)
      const todos = getTodosFromContent(content)
      updateNodeTodos(noteId, todos)
      await updateDocument('node', noteId, content)
    }
  }

  return {
    updater,
    updateFromContent
  }
}
