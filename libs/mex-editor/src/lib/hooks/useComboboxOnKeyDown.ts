import { getNextWrappingIndex, PlateEditor } from '@udecode/plate'
import { KeyboardHandler } from '@udecode/plate-core'
import { ComboboxKey, IComboboxItem } from '../components/ComboBox/types'
import { useSlashCommandOnChange } from '../components/SlashCommands/useSlashCommandOnChange'
import { useComboboxStore } from '../store/useComboboxStore'
import { useMexEditorStore } from '../store/useMexEditorStore'
import { useElementOnChange } from './useElementOnChange'

const pure = (id: string) => {
  if (id.endsWith(']]')) {
    return id.substr(0, id.length - 2)
  }
  return id
}

export type OnSelectItem = (editor: PlateEditor, item: IComboboxItem) => any // eslint-disable-line @typescript-eslint/no-explicit-any
export type OnNewItem = (name: string, parentId?) => void

export const getCreateableOnSelect = (onSelectItem: OnSelectItem, onNewItem: OnNewItem, creatable?: boolean) => {
  const creatableOnSelect = (editor: any, textVal: string) => {
    const items = useComboboxStore.getState().items
    const currentNodeKey = useMexEditorStore.getState().metaData.path
    const itemIndex = useComboboxStore.getState().itemIndex

    const val = pure(textVal)
    if (items[itemIndex]) {
      const item = items[itemIndex]

      if (item.key === '__create_new' && val !== '') {
        onSelectItem(editor, { key: String(items.length), text: val })
        onNewItem(val, currentNodeKey)
      } else onSelectItem(editor, item)
    } else if (val && creatable) {
      onSelectItem(editor, { key: String(items.length), text: val })
      onNewItem(val, currentNodeKey)
    }
  }

  return creatableOnSelect
}

/**
 * If the combobox is open, handle keyboard
 */
export const useComboboxOnKeyDown = (config: any): KeyboardHandler => {
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  // We need to create the select handlers ourselves here

  const { keys, slashCommands } = config
  const slashCommandOnChange = useSlashCommandOnChange(slashCommands)
  const comboboxKey: string = useComboboxStore.getState().key

  const elementOnChange = useElementOnChange(keys[comboboxKey], keys)

  return (editor) => (e) => {
    const comboboxKey: string = useComboboxStore.getState().key
    const comboType = keys[comboboxKey]

    const onSelectItemHandler =
      comboType.slateElementType === ComboboxKey.SLASH_COMMAND ? slashCommandOnChange : elementOnChange

    const creatabaleOnSelect = getCreateableOnSelect(
      onSelectItemHandler,
      (newItem, parentId?) => {
        comboType.newItemHandler(newItem, parentId)
      },
      comboboxKey !== ComboboxKey.SLASH_COMMAND
    )

    const itemIndex = useComboboxStore.getState().itemIndex
    const search = useComboboxStore.getState().search
    const items = useComboboxStore.getState().items
    const isOpen = !!useComboboxStore.getState().targetRange

    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()

        const newIndex = getNextWrappingIndex(1, itemIndex, items.length, () => undefined, true)
        return setItemIndex(newIndex)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()

        const newIndex = getNextWrappingIndex(-1, itemIndex, items.length, () => undefined, true)
        return setItemIndex(newIndex)
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        return closeMenu()
      }

      if (['Tab', 'Enter', ' ', ']'].includes(e.key)) {
        e.preventDefault()
        creatabaleOnSelect(editor, search)
        return false
      }
    }
    return false
  }
}
