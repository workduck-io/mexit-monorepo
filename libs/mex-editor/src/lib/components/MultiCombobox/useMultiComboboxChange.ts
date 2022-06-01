import { OnChange, usePlateEditorRef } from '@udecode/plate'
import { useCallback } from 'react'
import { useComboboxOnChange } from '../../hooks/useComboOnChange'
import { useComboboxStore } from '../../store/useComboboxStore'
import { fuzzySearch } from '../../utils/lib'
import { ComboboxKey, IComboboxItem } from '../ComboBox/types'
import { ComboboxType } from './types'

// * Handle multiple combobox
const useMultiComboboxOnChange = (
  editorId: string,
  keys: {
    [type: string]: ComboboxType
  }
): OnChange => {
  const editor = usePlateEditorRef(editorId)! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const closeMenu = useComboboxStore((state) => state.closeMenu)

  const setItems = useComboboxStore((state) => state.setItems)

  const comboboxOnChange = useComboboxOnChange({
    editor,
    keys
  })

  // * Construct the correct change handler
  const changeHandler = useCallback(() => {
    const res = comboboxOnChange()
    if (!res) return false
    const { search } = res

    if (!search && search !== '') return false

    const key = useComboboxStore.getState().key
    const maxSuggestions = useComboboxStore.getState().maxSuggestions

    const ct = keys[key]
    const data = ct.data

    if (!data) return false

    const searchItems = fuzzySearch(data, search, { keys: ['text'] })
    const items: IComboboxItem[] = (
      search !== '' ? searchItems.slice(0, maxSuggestions) : keys[key].data.slice(0, maxSuggestions)
    ).map((item) => ({
      key: item.value,
      icon: item.icon ?? ct.icon ?? undefined,
      text: item.text
    }))

    // TODO: Disable new item if key exists.
    if (key !== ComboboxKey.SLASH_COMMAND && search !== '') {
      items.push({
        key: '__create_new',
        icon: 'ri:add-circle-line',
        text: `Create New ${search}`
      })
    }
    setItems(items)

    return true
  }, [comboboxOnChange, setItems, keys])

  return useCallback(
    () => () => {
      const isOpen = !!useComboboxStore.getState().targetRange

      let changed: boolean | undefined = false
      changed = changeHandler !== undefined ? changeHandler() : false
      if (changed) return

      if (!changed && isOpen) {
        closeMenu()
      }
    },
    [closeMenu, changeHandler, keys]
  )
}

export default useMultiComboboxOnChange
