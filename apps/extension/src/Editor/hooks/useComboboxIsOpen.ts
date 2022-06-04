import { useComboboxStore } from '../store/combobox';

export const useComboboxIsOpen = () =>
  useComboboxStore((state) => !!state.targetRange);
