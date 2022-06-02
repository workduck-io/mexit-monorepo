import { useComboboxStore } from '../../Stores/useComboboxStore'

export const useComboboxIsOpen = () => useComboboxStore((state) => !!state.targetRange)
