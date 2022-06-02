import React from 'react'

import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { useOnSelectItem } from '../../Hooks/useOnSelectItem'
import { ComboboxKey } from '../../Types/Combobox'
import { Combobox } from '../Combobox'
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
