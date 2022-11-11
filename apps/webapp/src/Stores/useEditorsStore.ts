import { produce, enableMapSet } from 'immer'
import create from 'zustand'
import { devtools } from 'zustand/middleware'

import { useBufferStore } from '../Hooks/useEditorBuffer'

enableMapSet()

type EditorState = {
  blink?: boolean
  editing?: boolean
}

type NoteIdType = string

type MultipleEditors = {
  editors: Record<NoteIdType, EditorState> //* NoteId, isEditing
  pinned: Set<NoteIdType>
  setPinned: (pinned: Set<NoteIdType>) => void
  pinNote: (noteToPin: string) => void
  unPinNote: (noteToUnpin: string) => void
  addEditor: (noteId: string) => void
  isEmpty: boolean
  isEditingAnyPreview: () => boolean
  setIsEmpty: (status: boolean) => void
  changeEditorState: (noteId: string, editorState: EditorState) => void
  removeEditor: (noteId: string) => void
  lastOpenedEditor: () => any | undefined
  reset: () => void
}

const useMultipleEditors = create<MultipleEditors>(
  devtools(
    (set, get) => ({
      editors: {},
      pinned: new Set(),
      isEmpty: true,
      setPinned: (pinned) => set({ pinned }),
      unPinNote: (noteToUnpin) => {
        set(
          produce((draft) => {
            const isNotePinned = get().pinned.has(noteToUnpin)
            if (isNotePinned) draft.pinned.delete(noteToUnpin)
          })
        )
      },
      setIsEmpty: (status) => set({ isEmpty: status }),
      pinNote: (noteToPin) => {
        set(
          produce((draft) => {
            const isNotePinned = get().pinned.has(noteToPin)
            if (isNotePinned) return
            draft.pinned.add(noteToPin)
          })
        )
      },
      addEditor: (noteId) => {
        set(
          produce((draft) => {
            draft.editors[noteId] = {
              editing: false,
              blink: false
            }
            draft.isEmpty = false
          })
        )
      },
      isEditingAnyPreview: () => {
        const currentState = get().editors || {}
        const isEditing = Object.values(currentState)?.find((item) => item.editing)

        return !!isEditing
      },
      lastOpenedEditor: () => {
        const editors = get().editors || {}
        const mapOfEditors = Object.entries(editors)
        if (mapOfEditors.length > 0)
          return {
            nodeId: mapOfEditors.at(-1)[0],
            editorState: mapOfEditors.at(-1)[1]
          }
      },
      removeEditor: (noteId) => {
        const currentState = useBufferStore.getState().buffer?.[noteId]
        useBufferStore.getState().add(noteId, currentState)

        set(
          produce((draft) => {
            delete draft.editors[noteId]
            if (!draft.editors || Object.entries(draft.editors).length === 0) {
              draft.editors = {}
              draft.isEmpty = true
            }
          })
        )
      },
      changeEditorState: (noteId, editorState) => {
        set(
          produce((draft) => {
            const existingState = draft.editors[noteId]
            draft.editors[noteId] = { ...(existingState || {}), ...editorState }
          })
        )
      },
      reset: () => {
        set({
          editors: {},
          isEmpty: true,
          pinned: new Set()
        })
      }
    }),
    { name: 'Multiple Editors Store' }
  )
)

export default useMultipleEditors
