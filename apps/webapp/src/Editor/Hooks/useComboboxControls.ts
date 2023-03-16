import { useMemo } from 'react'

import { useCombobox } from 'downshift'

import { useComboboxIsOpen, useComboboxStore } from '@mexit/core'

export const useComboboxControls = (withNew: boolean) => {
  const isOpen = useComboboxIsOpen()
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const items = useComboboxStore((state) => state.items)

  // Menu combobox
  const { closeMenu, getMenuProps, getComboboxProps, getInputProps, getItemProps } = useCombobox({
    isOpen,
    highlightedIndex: itemIndex,
    items,
    circularNavigation: true
  })
  getMenuProps({}, { suppressRefError: true })
  getComboboxProps({}, { suppressRefError: true })
  getInputProps({}, { suppressRefError: true })

  return useMemo(
    () => ({
      closeMenu,
      getMenuProps,
      getItemProps
    }),
    [closeMenu, getItemProps, getMenuProps]
  )
}
