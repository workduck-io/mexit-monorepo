import { createStore, setStoreValue } from '../Utils/store'

export interface InternalMetadata {
  path: string
  delimiter?: string
}

export type EditorStateType = {
  // * Meta Data of editor
  internalMetadata: InternalMetadata
  setInternalMetadata: (metaData: InternalMetadata) => void
}

export const useMexEditorStore = createStore()<EditorStateType>((set) => ({
  internalMetadata: {},
  setInternalMetadata: setStoreValue(set, 'internalMetadata', 'setInternalMetadata')
}))
