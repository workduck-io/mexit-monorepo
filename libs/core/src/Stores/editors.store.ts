import { enableMapSet, produce } from 'immer'

import { StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

import { useBufferStore } from './buffer.store'
// import { useBufferStore } from '../Hooks/useEditorBuffer'

enableMapSet()

const multipleEditorsConfig = (set, get) => ({
  editors: {},
  pinned: new Set(),
  isEmpty: true,
  setPinned: (pinned) => set({ pinned }),
  unPinNote: (noteToUnpin: string) => {
    set(
      produce((draft) => {
        const isNotePinned = get().pinned.has(noteToUnpin)
        // eslint-disable-next-line
        // @ts-ignore
        if (isNotePinned) draft.pinned.delete(noteToUnpin)
      })
    )
  },
  setIsEmpty: (status: boolean) => set({ isEmpty: status }),
  pinNote: (noteToPin: string) => {
    set(
      produce((draft) => {
        const isNotePinned = get().pinned.has(noteToPin)
        if (isNotePinned) return
        // eslint-disable-next-line
        // @ts-ignore
        draft.pinned.add(noteToPin)
      })
    )
  },
  addEditor: (noteId: string) => {
    set(
      produce((draft) => {
        // eslint-disable-next-line
        // @ts-ignore
        draft.editors[noteId] = {
          editing: false,
          blink: false
        }
        // eslint-disable-next-line
        // @ts-ignore
        draft.isEmpty = false
      })
    )
  },
  isEditingAnyPreview: () => {
    const currentState = get().editors || {}
    // eslint-disable-next-line
    // @ts-ignore
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
      } as any;
  },
  removeEditor: (noteId: string) => {
    const currentState = useBufferStore.getState().buffer?.[noteId]
    useBufferStore.getState().add(noteId, currentState)

    set(
      produce((draft) => {
        // eslint-disable-next-line
        // @ts-ignore
        delete draft.editors[noteId]
        // eslint-disable-next-line
        // @ts-ignore
        if (!draft.editors || Object.entries(draft.editors).length === 0) {
          // eslint-disable-next-line
          // @ts-ignore
          draft.editors = {}
          // eslint-disable-next-line
          // @ts-ignore
          draft.isEmpty = true
        }
      })
    )
  },
  changeEditorState: (noteId: string, editorState) => {
    set(
      produce((draft) => {
        // eslint-disable-next-line
        // @ts-ignore
        const existingState = draft.editors[noteId]
        // eslint-disable-next-line
        // @ts-ignore
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
})

export const useMultipleEditors = createStore(multipleEditorsConfig, StoreIdentifier.EDITORS , false)


