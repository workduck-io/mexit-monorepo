import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  getParentNode,
  isCollapsed,
  isElement,
  PlateEditor
} from '@udecode/plate'
import { Range } from 'slate'

import { ComboTriggerType } from '../../../Stores/useComboboxStore'
import { ComboboxType, ComboTriggerDataType } from '../../Types/MultiCombobox'
import { getTextFromTrigger } from '../../Utils/getTextFromTrigger'

export const getTriggeredData = (
  editor: PlateEditor,
  comboboxItem: ComboTriggerType,
  setTrigger: any,
  isTrigger: boolean,
  blockSearch?: boolean
): ComboTriggerDataType | undefined => {
  const selection = editor?.selection
  const cursor = Range.start(selection)

  const isCursorAfterTrigger = getTextFromTrigger(editor, {
    at: cursor,
    trigger: comboboxItem,
    isTrigger
  })

  if (isCursorAfterTrigger) {
    const { range, textAfterTrigger, isBlockTriggered, blockRange, blockStart, textAfterBlockTrigger } =
      isCursorAfterTrigger

    if (!blockSearch || blockStart === undefined) setTrigger({ ...comboboxItem, at: range.anchor, blockAt: blockStart })

    return {
      range,
      key: comboboxItem.cbKey,
      search: { textAfterTrigger, textAfterBlockTrigger },
      isBlockTriggered,
      blockRange
    }
  }

  return undefined
}

const getTextFromTriggers = (
  editor: PlateEditor,
  keys: Record<string, ComboboxType>,
  isTrigger: ComboTriggerType | undefined,
  setIsTrigger: any
) => {
  const selection = editor?.selection

  if (selection && isCollapsed(selection)) {
    let triggerSelection

    const parentEntry = getParentNode(editor, editor.selection.focus)

    if (!parentEntry) return
    const [node] = parentEntry

    if (isElement(node) && (node.type === ELEMENT_CODE_LINE || node.type === ELEMENT_CODE_BLOCK)) {
      return undefined
    }

    // Check within keys
    if (!isTrigger) {
      Object.values(keys).map((comboType) => {
        const data = getTriggeredData(editor, comboType, setIsTrigger, false)
        if (data) {
          triggerSelection = data
        }
      })
    } else {
      triggerSelection = getTriggeredData(editor, isTrigger, setIsTrigger, true, !!isTrigger.blockAt)
    }

    if (!triggerSelection && isTrigger) {
      setIsTrigger(undefined)
    }

    return triggerSelection
  }

  return undefined
}

export default getTextFromTriggers
