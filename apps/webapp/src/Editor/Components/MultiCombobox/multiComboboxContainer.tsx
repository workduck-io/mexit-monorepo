import React from 'react'

import { mog } from '@mexit/core'

import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { useComboboxControls } from '../../Hooks/useComboboxControls'
import { getCreateableOnSelect } from '../../Hooks/useComboboxOnKeyDown'
import { ComboConfigData } from '../../Types/MultiCombobox'
import { Combobox } from '../Combobox'
import { useOnSelectItem } from './useMultiComboboxOnKeyDown'

export const ElementComboboxComponent = ({ keys, slashCommands, internal }: ComboConfigData) => {
  const comboboxKey: string = useComboboxStore.getState().key
  const comboRenderType = keys[comboboxKey]

  const { elementChangeHandler: onSelectItem, isSlash } = useOnSelectItem(
    comboboxKey,
    slashCommands,
    comboRenderType,
    internal.commands
  )
  // mog('ElementComboboxComponent ', { slashCommands, comboRenderType, comboboxKey, keys, internal })
  const onNewItem = (newItem, parentId?) => {
    return comboRenderType.newItemHandler(newItem, parentId)
  }

  const creatableOnSelectItem = getCreateableOnSelect(onSelectItem, onNewItem)

  return (
    <Combobox
      isSlash={isSlash}
      onSelectItem={isSlash ? (onSelectItem as any) : creatableOnSelectItem}
      onRenderItem={comboRenderType.renderElement}
    />
  )
}

// Handle multiple combobox
export const MultiComboboxContainer = ({ config }: { config: ComboConfigData }) => {
  useComboboxControls(true)

  return <ElementComboboxComponent {...config} />
}
