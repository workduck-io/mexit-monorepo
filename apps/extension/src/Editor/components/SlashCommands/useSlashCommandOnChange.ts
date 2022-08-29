import {
  getBlockAbove,
  getPluginType,
  insertNodes,
  insertTable,
  moveSelection,
  PlateEditor,
  select,
  TElement
} from '@udecode/plate'

import { isElder } from '@mexit/core'

import { useSnippets } from '../../../Hooks/useSnippets'
import { useComboboxStore } from '../../store/combobox'
import { IComboboxItem, SlashCommandConfig } from '../ComboBox/types'

export const useSlashCommandOnChange = (keys: { [type: string]: SlashCommandConfig }) => {
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const { getSnippetContent } = useSnippets()

  return (editor: PlateEditor, item: IComboboxItem) => {
    const targetRange = useComboboxStore.getState().targetRange
    const commandKey = Object.keys(keys).filter((k) => keys[k].command === item.key)[0]

    const commandConfig = keys[commandKey]
    if (targetRange) {
      try {
        if (isElder(commandKey, 'snip')) {
          const content = getSnippetContent(commandConfig.command)

          if (content) {
            select(editor, targetRange)
            insertNodes<TElement>(editor, content)
          }
        } else if (item.key === 'table') {
          select(editor, targetRange)
          insertTable(editor, { header: true, rowCount: 3 })
        } else {
          const type = getPluginType(editor, commandConfig.slateElementType)
          const data = commandConfig.getData ? commandConfig.getData(item) : {}

          select(editor, targetRange)

          insertNodes<TElement>(editor, {
            type: type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            children: [{ text: '' }],
            ...commandConfig.options,
            ...data
          })

          // move the selection after the inserted content
          moveSelection(editor)
        }
      } catch (e) {
        console.error(e)
      }
      return closeMenu()
    }

    return undefined
  }
}
