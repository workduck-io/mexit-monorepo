import { isCollapsed, PlateEditor } from '@udecode/plate'
import { Range } from 'slate'

import { getTextFromTrigger } from '../../utils/getTextFromTrigger'
import { ComboboxType } from './types'

export default function getTextFromTriggers(editor: PlateEditor, keys: { [type: string]: ComboboxType }) {
  const selection = editor?.selection

  if (selection && isCollapsed(selection)) {
    const cursor = Range.start(selection)

    // Check within keys
    const selections = Object.keys(keys).map((k) => {
      const comboType = keys[k]

      const isCursorAfterTrigger = getTextFromTrigger(editor, {
        at: cursor,
        trigger: comboType.trigger
      })

      if (isCursorAfterTrigger) {
        const { range, textAfterTrigger } = isCursorAfterTrigger

        return {
          range,
          key: comboType.cbKey,
          search: textAfterTrigger
        }
      }
      return undefined
    })

    // Get the trigger for which the selection in present
    const selected = selections.filter((k) => k !== undefined)

    if (selected.length > 0) {
      return selected[0] // We return the first caught selection
    }
  }
  // We return all that can be set in the useComboboxOnChange-keys function
  return undefined
}
