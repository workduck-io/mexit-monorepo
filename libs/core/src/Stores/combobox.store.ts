
// import { ComboboxKey, IComboboxItem } from '../Editor/Types/Combobox'
// import { ComboboxType, ComboSearchType } from '../Editor/Types/MultiCombobox'
// import { createStore, setStoreValue } from '../Editor/Utils/store'
import { Point } from 'slate'

import { ComboboxKey } from "../Types/Editor";
import { ComboboxType } from '../Types/MultiCombobox';
import { setStoreValue, StoreIdentifier } from '../Types/Store';
import { createStore } from '../Utils/storeCreator';

import { useEditorStore } from "./editor.store";

// import { useEditorStore } from './useEditorStore'

export type ComboTriggerType = ComboboxType & { at?: Point; blockAt?: Point }

export const comboboxStoreConfig = (set) => ({
  key: ComboboxKey.TAG,
  setKey: setStoreValue(set, 'key', 'setKey'),

  setBlockRange: setStoreValue(set, 'blockRange', 'setBlockRange'),

  isSlash: false,
  setIsSlash: setStoreValue(set, 'isSlash', 'setIsSlash'),

  isBlockTriggered: false,
  setIsBlockTriggered: setStoreValue(set, 'isBlockTriggered', 'setIsBlockTriggered'),

  setItemLoading: setStoreValue(set, 'itemLoading', 'setItemLoading'),

  maxSuggestions: 10,
  setMaxSuggestions: setStoreValue(set, 'maxSuggestions', 'setMaxSuggestions'),

  setActiveBlock: setStoreValue(set, 'activeBlock', 'setActiveBlock'),
  setPreview: setStoreValue(set, 'preview', 'setPreview'),

  search: { textAfterTrigger: '' },
  setSearch: setStoreValue(set, 'search', 'setSearch'),

  items: [],
  setItems: setStoreValue(set, 'items', 'setItems'),

  targetRange: null,
  setTargetRange: setStoreValue(set, 'targetRange', 'setTargetRange'),

  itemIndex: 0,
  setItemIndex: setStoreValue(set, 'itemIndex', 'setItemIndex'),

  combobox: null,
  setCombobox: setStoreValue(set, 'combobox', 'setCombobox'),

  closeMenu: () => {
    useEditorStore.getState().setTrigger(undefined)
    set((state) => {
      state.targetRange = null
      state.items = []
      state.search = ''
      state.itemIndex = 0
    })
  }
})

export const useComboboxStore = createStore(comboboxStoreConfig, StoreIdentifier.COMBOBOX , false)
