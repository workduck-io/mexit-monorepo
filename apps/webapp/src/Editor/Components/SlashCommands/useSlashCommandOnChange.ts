import { getPluginType, insertNodes, insertTable, PlateEditor, TElement } from '@udecode/plate'
import { Transforms } from 'slate'
import { IComboboxItem, SlashCommandConfig } from '../../Types/Combobox'
import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { isElder } from '@mexit/core'
import { useSnippets } from '../../../Hooks/useSnippets'

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
            Transforms.select(editor, targetRange)
            insertNodes<TElement>(editor, content)
          }
        } else if (item.key === 'table') {
          Transforms.select(editor, targetRange)
          insertTable(editor, { header: true })
        } else if (item.extended) {
          Transforms.select(editor, targetRange)
          Transforms.delete(editor)
          const search = useComboboxStore.getState().search
          // mog('extended', {
          //   item,
          //   commandKey
          // })
          commandConfig.onExtendedCommand(search.textAfterTrigger, editor)
        } else {
          // console.log('useElementOnChange 2', { type, pathAbove, isBlockEnd });
          const type = getPluginType(editor, commandConfig.slateElementType)
          const data = commandConfig.getData ? commandConfig.getData(item) : {}

          Transforms.select(editor, targetRange)

          insertNodes<TElement>(editor, {
            type: type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            children: [{ text: '' }],
            ...commandConfig.options,
            ...data
          })

          // move the selection after the inserted content
          Transforms.move(editor)
        }
      } catch (e) {
        console.error(e)
      }
      return closeMenu()
    }

    return undefined
  }
}
