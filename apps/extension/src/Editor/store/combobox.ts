import { UseComboboxReturnValue } from 'downshift';
import { Range } from 'slate';
import { ComboboxKey, IComboboxItem } from '../components/ComboBox/types';
import { createStore, setStoreValue } from '../utils/store.utils';

export type ComboboxState = {
  // Combobox key
  key: string;
  setKey: (value: string) => void;

  // Maximum number of suggestions
  maxSuggestions: number;
  setMaxSuggestions: (value: number) => void;

  // Tag search value
  search: string;
  setSearch: (value: string) => void;

  // Fetched tags
  items: IComboboxItem[];
  setItems: (value: IComboboxItem[]) => void;

  // Range from the tag trigger to the cursor
  targetRange: Range | null;
  setTargetRange: (value: Range | null) => void;

  // Highlighted index
  itemIndex: number;
  setItemIndex: (value: number) => void;

  combobox: UseComboboxReturnValue<IComboboxItem> | null;
  setCombobox: (value: UseComboboxReturnValue<IComboboxItem>) => void;

  closeMenu: () => void;
};

export const useComboboxStore = createStore()<ComboboxState>((set) => ({
  key: ComboboxKey.ILINK,
  setKey: setStoreValue(set, 'key', 'setKey'),

  maxSuggestions: 10,
  setMaxSuggestions: setStoreValue(set, 'maxSuggestions', 'setMaxSuggestions'),

  search: '',
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
      state.targetRange = null;
      state.items = [];
      state.search = '';
      state.itemIndex = 0;
    });
  },
}));
