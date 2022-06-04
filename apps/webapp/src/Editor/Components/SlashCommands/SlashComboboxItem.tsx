import { ComboboxItemProps } from '../../Types/Combobox'

export type ISlashComboboxItemData =
  | {
      isNew?: boolean
    }
  | undefined

export const SlashComboboxItem = ({ item }: ComboboxItemProps) => {
  return !(item.data as ISlashComboboxItemData)?.isNew ? item.text : null
}
