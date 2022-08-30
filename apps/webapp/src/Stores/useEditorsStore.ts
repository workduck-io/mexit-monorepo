import { produce } from 'immer'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { defaultContent, NodeEditorContent } from '@mexit/core'

import { useContentStore } from './useContentStore'

type MultipleEditors = {
  editors: Record<string, boolean> //* NoteId, isEditing
  contents: Record<string, NodeEditorContent> //* NoteId, Note's content
  addEditor: (noteId: string) => void
  setContents: (contents: Record<string, NodeEditorContent>) => void
}

const useMultipleEditors = create<MultipleEditors>(
  devtools(
    persist(
      (set) => ({
        editors: {},
        contents: {},
        addEditor: (noteId) => {
          const existingContent = useContentStore.getState().getContent(noteId)
          set(
            produce((draft) => {
              draft.editors[noteId] = true
              draft.contents[noteId] = existingContent || defaultContent.content
            })
          )
        },
        setContents: (contents) => {
          set(
            produce((draft) => {
              draft.contents = contents
            })
          )
        }
      }),
      { name: 'MULTIPLE_EDITORS_STORE' }
    ),
    { name: 'Multiple Editors Store' }
  )
)

export default useMultipleEditors
