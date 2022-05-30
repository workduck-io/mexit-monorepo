import { useComboboxStore } from '../store/useComboboxStore'

export const useComboboxIsOpen = () => useComboboxStore((state) => !!state.targetRange)
