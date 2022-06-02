import { PlateEditor } from '@udecode/plate'
import { KeyboardHandler } from '@udecode/plate-core'

import { isElder } from '@mexit/shared'
import { mog } from '@mexit/core'

import { useComboboxStore } from '../../Stores/useComboboxStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { CreateNewPrefix, SnippetCommandPrefix } from '../constants'
import { ComboboxKey, IComboboxItem } from '../Types/Combobox'
import { Editor, Transforms } from 'slate'
import { useSlashCommandOnChange } from '../Components/SlashCommands/useSlashCommandOnChange'
import { useElementOnChange as getElementOnChange } from '../Components/MultiCombobox/useMultiComboboxOnKeyDown'
import { ELEMENT_INLINE_BLOCK } from '../elements'
import { getNextWrappingIndex } from '../Utils/getNextWrappingIndex'
import { ComboConfigData, ComboSearchType } from '../Types/MultiCombobox'

// import { mog } from '../../../../utils/lib/helper'
// import { useEditorStore } from '../../../../store/useEditorStore'
// import { ComboConfigData } from '../../multi-combobox/multiComboboxContainer'
// import { useElementOnChange as getElementOnChange } from '../../multi-combobox/useMultiComboboxOnKeyDown'
// import { useSlashCommandOnChange } from '../../SlashCommands/useSlashCommandOnChange'
// import { IComboboxItem } from '../components/Combobox.types'
// import { ComboboxKey, useComboboxStore } from '../useComboboxStore'
// import { getNextWrappingIndex } from '../utils/getNextWrappingIndex'
// import { isElder } from '../../../../components/mex/Sidebar/treeUtils'
// import { FlowCommandPrefix } from '../../SlashCommands/useSyncConfig'
// import { SnippetCommandPrefix } from '../../../../hooks/useSnippets'
// import { CreateNewPrefix } from '../../multi-combobox/useMultiComboboxChange'
// import { Editor, Transforms } from 'slate'
// import { ComboSearchType } from '../../multi-combobox/types'
// import { ELEMENT_INLINE_BLOCK } from '../../InlineBlock/types'

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

export type OnSelectItem = (editor: PlateEditor, item: IComboboxItem, elementType?: string) => any // eslint-disable-line @typescript-eslint/no-explicit-any
export type OnNewItem = (name: string, parentId?) => string | undefined

export const getCreateableOnSelect = (onSelectItem: OnSelectItem, onNewItem: OnNewItem, creatable?: boolean) => {
  const creatableOnSelect = (editor: any, selectVal: IComboboxItem | string, elementType?: string) => {
    const items = useComboboxStore.getState().items
    const currentNodeKey = useEditorStore.getState().node.path
    const itemIndex = useComboboxStore.getState().itemIndex

    mog('getCreatableInSelect', { items, selectVal, creatable, itemIndex })

    if (items[itemIndex]) {
      const item = items[itemIndex]
      mog('getCreatableInSelect', { item, selectVal, creatable })
      if (item.key === '__create_new' && selectVal) {
        const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
        const res = onNewItem(val, currentNodeKey)
        // mog('getCreatableInSelect', { item, val, selectVal, creatable, res })
        mog('Select__CN clause', { val, selectVal, creatable, res })
        if (res) onSelectItem(editor, { key: String(items.length), text: res }, elementType)
      } else onSelectItem(editor, item, elementType)
    } else if (selectVal && creatable) {
      const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
      const res = onNewItem(val, currentNodeKey)
      mog('SelectElse clause', { val, selectVal, creatable, res })
      // onSelectItem(editor, { key: String(items.length), text: res ?? val })
      if (res) onSelectItem(editor, { key: String(items.length), text: val }, elementType)
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
        creatabaleOnSelect(editor, search, ELEMENT_INLINE_BLOCK)
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
