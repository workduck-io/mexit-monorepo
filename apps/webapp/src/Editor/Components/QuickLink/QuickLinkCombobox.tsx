import * as React from 'react'
import { Combobox } from '../../../Components/Combobox'
import { useComboboxStore } from '../../../../Stores/useComboboxStore'
import { ComboboxKey } from '../../../Types/Combobox'
import { QuickLinkComboboxItem } from './QuickLinkComboboxItem'
import { useOnSelectItem } from '../../../Hooks/useOnSelectItem'

export const ILinkComboboxComponent = () => {
  const onSelectItem = useOnSelectItem()

  return <Combobox onSelectItem={onSelectItem as any} onRenderItem={QuickLinkComboboxItem} />
}

export const ILinkCombobox = () => {
  const key = useComboboxStore((state) => state.key)

  return (
    <div style={key !== ComboboxKey.ILINK ? { display: 'none' } : {}}>
      <ILinkComboboxComponent />
    </div>
  )
}
