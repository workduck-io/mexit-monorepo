import { BaseRange, Point } from 'slate'

import { ComboboxKey } from '../Types/Editor'
import { ComboboxType, ComboSearchType } from '../Types/MultiCombobox'
import { setStoreValue, StoreIdentifier } from '../Types/Store'
import { createStore } from '../Utils/storeCreator'

import { useEditorStore } from './editor.store'

export type ComboTriggerType = ComboboxType & { at?: Point; blockAt?: Point }

type ItemLoading = {
  item: string
  message?: string
}

export const comboboxStoreConfig = (set) => ({
  key: ComboboxKey.TAG,
  setKey: setStoreValue(set, 'key', 'setKey'),

  blockRange: undefined as BaseRange | null,
  setBlockRange: setStoreValue(set, 'blockRange', 'setBlockRange'),

  isSlash: false,
  setIsSlash: setStoreValue(set, 'isSlash', 'setIsSlash'),

  isBlockTriggered: false,
  setIsBlockTriggered: setStoreValue(set, 'isBlockTriggered', 'setIsBlockTriggered'),

  itemLoading: undefined as ItemLoading | undefined,
  setItemLoading: setStoreValue(set, 'itemLoading', 'setItemLoading'),

  maxSuggestions: 10,
  setMaxSuggestions: setStoreValue(set, 'maxSuggestions', 'setMaxSuggestions'),

  activeBlock: undefined as any,
  setActiveBlock: setStoreValue(set, 'activeBlock', 'setActiveBlock'),

  preview: undefined as any,
  setPreview: setStoreValue(set, 'preview', 'setPreview'),

  search: { textAfterTrigger: '' } as ComboSearchType,
  setSearch: setStoreValue(set, 'search', 'setSearch'),

  items: [],
  setItems: setStoreValue(set, 'items', 'setItems'),

  targetRange: null as Range | null,
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

export const useComboboxStore = createStore(comboboxStoreConfig, StoreIdentifier.COMBOBOX, false)

export const useComboboxIsOpen = () => useComboboxStore((state) => !!state.targetRange)
