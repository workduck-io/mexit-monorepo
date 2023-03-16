import { useMemo } from 'react'

import { useComboboxStore } from '@mexit/core'


export const useComboboxOpen = () => {
  const targetRange = useComboboxStore((state) => state.targetRange)

  const items = useComboboxStore((state) => state.items)

  const isOpen = useMemo(() => {
    return !!targetRange && items.length > 0
  }, [targetRange, items])

  return isOpen
}
