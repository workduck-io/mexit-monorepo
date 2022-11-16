import { getPlateEditorRef, insertText, PlateEditor, select } from '@udecode/plate'
import { KeyboardHandler } from '@udecode/plate-core'
import { findIndex, groupBy } from 'lodash'

import { mog, isElder } from '@mexit/core'

import { useComboboxStore } from '../../Stores/useComboboxStore'
import { useDataStore } from '../../Stores/useDataStore'
import { useElementOnChange as getElementOnChange } from '../Components/MultiCombobox/useMultiComboboxOnKeyDown'
import { useSlashCommandOnChange } from '../Components/SlashCommands/useSlashCommandOnChange'
import { ComboboxKey, IComboboxItem } from '../Types/Combobox'
import { ComboConfigData, ComboSearchType } from '../Types/MultiCombobox'
import { getNextWrappingIndex } from '../Utils/getNextWrappingIndex'
import { getNodeIdFromEditor } from '../Utils/helper'
import { CreateNewPrefix, SnippetCommandPrefix } from '../constants'

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
    const editorId = getPlateEditorRef().id
    const noteId = getNodeIdFromEditor(editorId)

    const currentNodeKey = useDataStore.getState().ilinks.find((i) => i.nodeid === noteId)?.path
    const itemIndex = useComboboxStore.getState().itemIndex

    mog('getCreatableInSelect', { items, selectVal, creatable, itemIndex })

    if (items[itemIndex]) {
      const item = items[itemIndex]
      mog('getCreatableInSelect', { item, selectVal, creatable })
      if (item.key === '__create_new' && selectVal) {
        const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
        const res = await onNewItem(val, noteId)
        if (res) {
          onSelectItem(editor, { key: String(items.length), text: res }, elementType, tab)
        }
        mog('CreatableInSelectRes: ', { res })
      } else onSelectItem(editor, item, elementType, tab)
    } else if (selectVal && creatable) {
      const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
      const res = onNewItem(val, noteId)
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
    select(editor, range)
    insertText(editor, text)
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
    const editorId = getPlateEditorRef().id
    const noteId = getNodeIdFromEditor(editorId)

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
          return internal.ilink.newItemHandler(newItem, noteId)
        }
        if (comboType) return comboType.newItemHandler(newItem, noteId)
      },
      comboboxKey !== ComboboxKey.SLASH_COMMAND
    )

    const groups = Object.keys(groupBy(items, (n) => n.type))
    const indexes = groups.map((gn) => findIndex(items, (n: any) => n.type === gn))

    if (isOpen) {
      // if (!isBlockTriggered) {
      if (!isBlockTriggered) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()

          if (e.metaKey) {
            for (let i = 0; i < indexes.length; i++) {
              const categoryIndex = indexes[i]
              if (categoryIndex > itemIndex && items[categoryIndex].type !== items[itemIndex].type) {
                return setItemIndex(categoryIndex)
              }
            }
          } else {
            const newIndex = getNextWrappingIndex(1, itemIndex, items.length, () => undefined, false)
            return setItemIndex(newIndex)
          }
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()

          if (e.metaKey) {
            for (let i = indexes[indexes.length - 1]; i > -1; i--) {
              const categoryIndex = indexes[i]
              if (categoryIndex < itemIndex && items[categoryIndex].type !== items[itemIndex].type) {
                return setItemIndex(categoryIndex)
              }
            }
          } else {
            const newIndex = getNextWrappingIndex(-1, itemIndex, items.length, () => undefined, false)
            return setItemIndex(newIndex)
          }
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
