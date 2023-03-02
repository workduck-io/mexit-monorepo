import { UseComboboxReturnValue } from 'downshift'
import { BaseRange, Range } from 'slate'

import { ComboboxKey, IComboboxItem } from '../components/ComboBox/types'
import { createStore, setStoreValue } from '../utils/store.utils'

export type ComboboxState = {
  // Combobox key
  key: string
  setKey: (value: string) => void

  // Maximum number of suggestions
  maxSuggestions: number
  setMaxSuggestions: (value: number) => void

  activeBlock: any
  setActiveBlock: (block: any) => void

  // Tag search value
  search: string
  setSearch: (value: string) => void

  itemLoading?: string | undefined
  setItemLoading: (itemKey?: string | undefined) => void

  // Fetched tags
  items: IComboboxItem[]
  setItems: (value: IComboboxItem[]) => void

  isBlockTriggered: boolean
  setIsBlockTriggered: (value: boolean) => void

  blockRange: BaseRange | null
  setBlockRange: (value: BaseRange) => void

  // Range from the tag trigger to the cursor
  targetRange: Range | null
  setTargetRange: (value: Range | null) => void

  // Highlighted index
  itemIndex: number
  setItemIndex: (value: number) => void

  isSlash: boolean
  setIsSlash: (value: boolean) => void

  preview?: any
  setPreview: (value: any) => void

  showPreview: boolean
  setShowPreview: (value: boolean) => void

  combobox: UseComboboxReturnValue<IComboboxItem> | null
  setCombobox: (value: UseComboboxReturnValue<IComboboxItem>) => void

  closeMenu: () => void
}

export const useComboboxStore = createStore()<ComboboxState>((set) => ({
  key: ComboboxKey.TAG,
  setKey: setStoreValue(set, 'key', 'setKey'),

  setBlockRange: setStoreValue(set, 'blockRange', 'setBlockRange'),

  isSlash: false,
  setIsSlash: setStoreValue(set, 'isSlash', 'setIsSlash'),

  isBlockTriggered: false,
  setIsBlockTriggered: setStoreValue(set, 'isBlockTriggered', 'setIsBlockTriggered'),

  maxSuggestions: 10,
  setMaxSuggestions: setStoreValue(set, 'maxSuggestions', 'setMaxSuggestions'),

  setItemLoading: setStoreValue(set, 'itemLoading', 'setItemLoading'),

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
    set((state) => {
      state.targetRange = null
      state.items = []
      state.search = ''
      state.itemIndex = 0
    })
  }
}))
