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

    Object.entries(notes).forEach(async ([noteId, note]) => {
      if (note?.content) {
        // * Update Tags And Links from note's content
        updateLinksFromContent(noteId, note.content)
        updateTagsFromContent(noteId, note.content)

        // * Update Todos status and content
        const todos = getTodosFromContent(note.content)
        updateNodeTodos(noteId, todos)

        // * Update Search index
        await updateDocument({
          id: noteId,
          contents: note.content,
          title: metadatas[noteId]?.title
        })
      }
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
      // console.log('updateFromContent', noteId, todos, content)
      await updateDocument({
        id: noteId,
        contents: content,
        title: metadata?.title
      })
    }
  }

  return {
    updateFromContent,
    updateFromNotes
  }
}
