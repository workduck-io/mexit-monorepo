import { useCallback } from 'react'

import {
  deleteText,
  getBlockAbove,
  getPluginType,
  insertNodes,
  insertText,
  isEndPoint,
  moveSelection,
  PlateEditor,
  select,
  TElement
} from '@udecode/plate'

import { IComboboxItem } from '../components/ComboBox/types'
import { ComboboxKey } from '../components/ComboBox/types'
import { useComboboxStore } from '../store/combobox'
import { useComboboxIsOpen } from './useComboboxIsOpen'

/**
 * Select the target range, add a ilink node and set the target range to null
 */
export const useOnSelectItem = () => {
  const isOpen = useComboboxIsOpen()
  const targetRange = useComboboxStore((state) => state.targetRange)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  return useCallback(
    (editor: PlateEditor, item: IComboboxItem) => {
      const type = getPluginType(editor, ComboboxKey.ILINK)

      if (isOpen && targetRange) {
        try {
          const pathAbove = getBlockAbove(editor)?.[1]
          const isBlockEnd = editor.selection && pathAbove && isEndPoint(editor, editor.selection.anchor, pathAbove)

          // insert a space to fix the bug
          if (isBlockEnd) {
            insertText(editor, ' ')
          }

          // select the ilink text and insert the ilink element
          select(editor, targetRange)
          insertNodes<TElement>(editor, {
            type: type as any,
            children: [{ text: '' }],
            value: item.text
          })
          // console.log({ type, item });

          // move the selection after the ilink element
          moveSelection(editor)

          // delete the inserted space
          if (isBlockEnd) {
            deleteText(editor)
          }
        } catch (e) {
          console.error(e)
        }

        return closeMenu()
      }
      return undefined
    },
    [closeMenu, isOpen, targetRange]
  )
}
