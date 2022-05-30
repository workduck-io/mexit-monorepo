import * as React from 'react'
import { Combobox } from '../../../components/ComboBox'
import { useOnSelectItem } from '../../../hooks/useOnSelectItem'
import { useComboboxStore } from '../../../store/useComboboxStore'
import { ComboboxKey } from '../../../types'
import { TagComboboxItem } from './TagComboboxItem'

export const TagComboboxComponent = () => {
  const onSelectItem = useOnSelectItem()

  return <Combobox onSelectItem={onSelectItem as any} onRenderItem={TagComboboxItem} />
}

export const TagCombobox = () => {
  const key = useComboboxStore((state) => state.key)

  return (
    <div style={key !== ComboboxKey.TAG ? { display: 'none' } : {}}>
      <TagComboboxComponent />
    </div>
  )
}
