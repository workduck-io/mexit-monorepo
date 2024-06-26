import { Indexes } from '@workduck-io/mex-search'

import { getTodosFromContent, NodeEditorContent, useContentStore, useMetadataStore, useTodoStore } from '@mexit/core'

import { useLinks } from './useLinks'
import { useSearch } from './useSearch'
import { useTags } from './useTags'

export const useUpdater = () => {
  const { updateLinksFromContent } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)
  const setContent = useContentStore((store) => store.setContent)
  const setContents = useContentStore((store) => store.setContents)
  const addMetadata = useMetadataStore((store) => store.addMetadata)
  const { updateTagsFromContent } = useTags()
  const { updateDocument } = useSearch()

  const updateFromNotes = async (notes: Record<string, any>, metadatas: Record<string, any>) => {
    setContents(notes)
    addMetadata('notes', metadatas)

    Object.entries(async ([noteId, content]) => {
      updateLinksFromContent(noteId, content)
      updateTagsFromContent(noteId, content)
      const todos = getTodosFromContent(content)
      updateNodeTodos(noteId, todos)
      await updateDocument({
        id: noteId,
        contents: content,
        indexKey: Indexes.MAIN
      })
    })
  }

  const updateFromContent = async (noteId: string, content: NodeEditorContent, metadata?: any) => {
    if (content) {
      setContent(noteId, content)
      if (metadata) addMetadata('notes', { [noteId]: metadata })
      updateLinksFromContent(noteId, content)
      updateTagsFromContent(noteId, content)
      const todos = getTodosFromContent(content)
      updateNodeTodos(noteId, todos)
      await updateDocument({
        id: noteId,
        contents: content,
        indexKey: Indexes.MAIN
      })
    }
  }

  return {
    updateFromContent,
    updateFromNotes
  }
}
