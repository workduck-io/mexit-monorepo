import * as React from 'react'

import { ComboboxItemProps } from '../../Types/Combobox'

export type QuickLinkComboboxItemData =
  | {
      isNew?: boolean
    }
  | undefined

export const QuickLinkComboboxItem = ({ item }: ComboboxItemProps) => {
  // console.log({ item })
  return !(item.data as QuickLinkComboboxItemData)?.isNew ? (
    item.text
  ) : (
    <div className="inline-flex items-center">
      New &quot;<span className="font-medium">{item.text}</span>&quot; node
    </div>
  )
}
