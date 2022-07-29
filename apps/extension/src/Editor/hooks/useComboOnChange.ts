import { useCallback } from 'react'

import { PlateEditor } from '@udecode/plate'

import getTextFromTriggers from '../components/MultiCombobox/getMultiTextFromTrigger'
import { ComboboxType } from '../components/MultiCombobox/types'
import { useComboboxStore } from '../store/combobox'

/**
 * If the cursor is after the trigger and at the end of the word:
 * Set target range, set search, reset tag index.
 */
export const useComboboxOnChange = ({
  editor,
  keys
}: {
  editor: PlateEditor
  keys: {
    [type: string]: ComboboxType
  }
}) => {
  const setTargetRange = useComboboxStore((state) => state.setTargetRange)
  const setSearch = useComboboxStore((state) => state.setSearch)
  const setKey = useComboboxStore((state) => state.setKey)

  return useCallback(
    (...args) => {
      const textFromTrigger = getTextFromTriggers(editor, keys)
      if (textFromTrigger) {
        const { key, search, range } = textFromTrigger

        setKey(key)
        setTargetRange(range)
        setSearch(search)
        return { search }
      }

      return { search: undefined }
    },
    [editor, keys, setKey, setTargetRange, setSearch]
  )
}
