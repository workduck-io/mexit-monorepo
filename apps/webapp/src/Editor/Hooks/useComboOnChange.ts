import { useCallback } from 'react'

import { useComboboxStore } from '../../Stores/useComboboxStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import getTextFromTriggers from '../Components/MultiCombobox/getMultiTextFromTrigger'
import { ComboboxType, ComboTriggerDataType } from '../Types/MultiCombobox'
import { PlateEditor } from '@udecode/plate'

/**
 * If the cursor is after the trigger and at the end of the word:
 * Set target range, set search, reset tag index.
 */
export const useComboboxOnChange = ({ editor, keys }: { editor: PlateEditor; keys: Record<string, ComboboxType> }) => {
  const setTargetRange = useComboboxStore((state) => state.setTargetRange)
  const setSearch = useComboboxStore((state) => state.setSearch)
  const setKey = useComboboxStore((state) => state.setKey)
  const isTrigger = useEditorStore((store) => store.trigger)
  const setIsTrigger = useEditorStore((store) => store.setTrigger)
  const setIsBlockTriggered = useComboboxStore((store) => store.setIsBlockTriggered)
  const setBlockRange = useComboboxStore((store) => store.setBlockRange)

  return useCallback(() => {
    const triggeredData: ComboTriggerDataType = getTextFromTriggers(editor, keys, isTrigger, setIsTrigger)

    if (triggeredData) {
      const { key, search, blockRange, range, isBlockTriggered } = triggeredData

      setKey(key)
      setSearch(search)
      setTargetRange(range)
      setBlockRange(blockRange)
      setIsBlockTriggered(isBlockTriggered)

      return { search }
    }

    return { search: undefined }
  }, [editor, keys, isTrigger, setKey, setTargetRange, isTrigger, setSearch])
}
