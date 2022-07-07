import { PlateEditor } from '@udecode/plate'
import { KeyboardHandler } from '@udecode/plate-core'

import { mog, isElder } from '@mexit/core'

import { useComboboxStore } from '../../Stores/useComboboxStore'
import { CreateNewPrefix, SnippetCommandPrefix } from '../constants'
import { ComboboxKey, IComboboxItem } from '../Types/Combobox'
import { Editor, Transforms } from 'slate'
import { useSlashCommandOnChange } from '../Components/SlashCommands/useSlashCommandOnChange'
import { useElementOnChange as getElementOnChange } from '../Components/MultiCombobox/useMultiComboboxOnKeyDown'
import { ELEMENT_INLINE_BLOCK } from '@mexit/core'
import { getNextWrappingIndex } from '../Utils/getNextWrappingIndex'
import { ComboConfigData, ComboSearchType } from '../Types/MultiCombobox'
import { useMexEditorStore } from './useMexEditorStore'

const pure = (id: string) => {
  let newId = id
  if (newId.endsWith(']]')) {
    newId = newId.slice(0, newId.length - 2)
  }
  if (newId.startsWith(CreateNewPrefix)) {
    newId = newId.slice(CreateNewPrefix.length)
  }
  return newId
}

export const isInternalCommand = (search?: string) => {
  if (search !== undefined && search !== '')
    return isElder(search, SnippetCommandPrefix) || SnippetCommandPrefix.startsWith(search)

  return false
}

export type OnSelectItem = (editor: PlateEditor, item: IComboboxItem, elementType?: string, tab?: boolean) => any // eslint-disable-line @typescript-eslint/no-explicit-any
export type OnNewItem = (name: string, parentId?) => string | undefined

export const getCreateableOnSelect = (onSelectItem: OnSelectItem, onNewItem: OnNewItem, creatable?: boolean) => {
  const creatableOnSelect = async (
    editor: any,
    selectVal: IComboboxItem | string,
    elementType?: string,
    tab?: boolean
  ) => {
    const items = useComboboxStore.getState().items
    const currentNodeKey = useMexEditorStore.getState().internalMetadata.path
    const itemIndex = useComboboxStore.getState().itemIndex

    mog('getCreatableInSelect', { items, selectVal, creatable, itemIndex })

    if (items[itemIndex]) {
      const item = items[itemIndex]
      mog('getCreatableInSelect', { item, selectVal, creatable })
      if (item.key === '__create_new' && selectVal) {
        const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
        const res = await onNewItem(val, currentNodeKey)
        if (res) {
          onSelectItem(editor, { key: String(items.length), text: res }, elementType, tab)
        }
        mog('CreatableInSelectRes: ', { res })
      } else onSelectItem(editor, item, elementType, tab)
    } else if (selectVal && creatable) {
      const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
      const res = onNewItem(val, currentNodeKey)
      mog('SelectElse clause', { val, selectVal, creatable, res })
      // onSelectItem(editor, { key: String(items.length), text: res ?? val })
      if (res) onSelectItem(editor, { key: String(items.length), text: val }, elementType, tab)
    }
  }

  return creatableOnSelect
}

export const replaceFragment = (editor: any, range: any, text: string) => {
  const sel = editor.selection

  if (sel) {
    Transforms.select(editor, range)
    Editor.insertText(editor, text)
  }
}

/**
 * If the combobox is open, handle keyboard
 */
export const useComboboxOnKeyDown = (config: ComboConfigData): KeyboardHandler => {
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  // We need to create the select handlers ourselves here

  const { keys, slashCommands, internal } = config
  const slashCommandOnChange = useSlashCommandOnChange({ ...slashCommands, ...internal.commands })
  const comboboxKey: string = useComboboxStore.getState().key

  const elementOnChange = getElementOnChange(keys[comboboxKey], keys)

  // * Replace textBeforeTrigger with provided text value in editor

  return (editor) => (e) => {
    const comboboxKey: string = useComboboxStore.getState().key

    const comboType = keys[comboboxKey]

    const itemIndex = useComboboxStore.getState().itemIndex
    const isBlockTriggered = useComboboxStore.getState().isBlockTriggered
    const { textAfterTrigger: search }: ComboSearchType = useComboboxStore.getState().search
    const items = useComboboxStore.getState().items
    const targetRange = useComboboxStore.getState().targetRange
    const isOpen = !!targetRange && items.length > 0
    const item = items[itemIndex]

    // mog('useComboboxOnKeyDown', {
    //   item,
    //   items,
    //   slashCommands
    // })

    const isSlashCommand =
      comboType.slateElementType === ComboboxKey.SLASH_COMMAND ||
      (comboType.slateElementType === ComboboxKey.INTERNAL && isInternalCommand(item ? item.key : search))

    const onSelectItemHandler = isSlashCommand ? slashCommandOnChange : elementOnChange
    const creatabaleOnSelect = getCreateableOnSelect(
      onSelectItemHandler,
      (newItem, parentId?) => {
        // mog('CreatableOnSelect', { comboType, comboboxKey, il: internal.ilink })
        if (comboboxKey === ComboboxKey.INTERNAL && !isInternalCommand(search)) {
          // mog('CreatableOnSelect', { comboType, comboboxKey })
          return internal.ilink.newItemHandler(newItem, parentId)
        }
        if (comboType) return comboType.newItemHandler(newItem, parentId)
      },
      comboboxKey !== ComboboxKey.SLASH_COMMAND
    )

    if (isOpen) {
      // if (!isBlockTriggered) {
      if (!isBlockTriggered) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()

          const newIndex = getNextWrappingIndex(1, itemIndex, items.length, () => undefined, true)

          // * Replace current searched text with list item
          // replaceFragment(editor, targetRange, items[newIndex].text)

          return setItemIndex(newIndex)
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()

          const newIndex = getNextWrappingIndex(-1, itemIndex, items.length, () => undefined, true)

          // * Replace current searched text with list item
          // replaceFragment(editor, targetRange, items[newIndex].text)

          return setItemIndex(newIndex)
        }

        if (e.key === 'Escape') {
          e.preventDefault()
          return closeMenu()
        }
      }

      if (e.key === 'Tab') {
        // * On Tab insert the selected item as Inline Block
        e.preventDefault()
        creatabaleOnSelect(editor, search, undefined, true)
        return false
      }
      // }

      if (['Enter', ']'].includes(e.key)) {
        e.preventDefault()
        creatabaleOnSelect(editor, search)
        return false
      }
    }
    return false
  }
}
