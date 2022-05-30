import { MetaData } from '../types/editor';
import { createStore, setStoreValue } from '../utils/store.utils';

export type EditorStateType = {
  // * Meta Data of editor
  metaData: MetaData;
  setMetaData: (metaData: MetaData) => void;
};

export const useMexEditorStore = createStore()<EditorStateType>((set) => ({
  metaData: {},
  setMetaData: setStoreValue(set, 'metaData', 'setMetaData'),
}));
