import { enableMapSet, produce } from 'immer'

import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

import { useBufferStore } from './buffer.store'

enableMapSet()

type EditorState = {
  blink?: boolean
  editing?: boolean
}

type NodeIdType = string

const getInitialState = () => ({
  editors: {} as Record<NodeIdType, EditorState>,
  pinned: new Set<NodeIdType>(),
  isEmpty: true
})

const multipleEditorsConfig = (set, get) => ({
  ...getInitialState(),
  setPinned: (pinned: Set<NodeIdType>) => set({ pinned }),
  unPinNote: (noteToUnpin: NodeIdType) => {
    set(
      produce((draft: any) => {
        const isNotePinned = get().pinned.has(noteToUnpin)
        if (isNotePinned) draft.pinned.delete(noteToUnpin)
      })
    )
  },
  setIsEmpty: (status: boolean) => set({ isEmpty: status }),
  pinNote: (noteToPin: NodeIdType) => {
    set(
      produce((draft: any) => {
        const isNotePinned = get().pinned.has(noteToPin)
        if (isNotePinned) return
        draft.pinned.add(noteToPin)
      })
    )
  },
  addEditor: (noteId: NodeIdType) => {
    set(
      produce((draft: any) => {
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
    const isEditing = Object.values(currentState)?.find((item: EditorState) => item.editing)

    return !!isEditing
  },
  lastOpenedEditor: () => {
    const editors = get().editors || {}
    const mapOfEditors = Object.entries(editors)
    if (mapOfEditors.length > 0)
      return {
        nodeId: mapOfEditors.at(-1)[0],
        editorState: mapOfEditors.at(-1)[1]
      } as any
  },
  removeEditor: (noteId: NodeIdType) => {
    const currentState = useBufferStore.getState().buffer?.[noteId]
    useBufferStore.getState().add(noteId, currentState)

    set(
      produce((draft: any) => {
        delete draft.editors[noteId]

        if (!draft.editors || Object.entries(draft.editors).length === 0) {
          draft.editors = {}
          draft.isEmpty = true
        }
      })
    )
  },
  changeEditorState: (noteId: NodeIdType, editorState: EditorState) => {
    set(
      produce((draft: any) => {
        const existingState = draft.editors[noteId]
        draft.editors[noteId] = { ...(existingState || {}), ...editorState }
      })
    )
  },
  reset: () => {
    const initialState = getInitialState()
    set(initialState)
  }
})

export const useMultipleEditors = createStore(multipleEditorsConfig, StoreIdentifier.EDITORS, false)
