import * as React from 'react'
import { ComboboxItemProps } from '../../Types/Combobox'

export type ITagComboboxItemData =
  | {
      isNew?: boolean
    }
  | undefined

export const TagComboboxItem = ({ item }: ComboboxItemProps) => {
  return !(item.data as ITagComboboxItemData)?.isNew ? (
    item.text
  ) : (
    <div className="inline-flex items-center">
      New &quot;<span className="font-medium">{item.text}</span>&quot; tag
    </div>
  )
}
