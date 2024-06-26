import {
  deleteText,
  getPluginType,
  insertNodes,
  insertTable,
  moveSelection,
  PlateEditor,
  select,
  TElement
} from '@udecode/plate'

import { camelCase, FloatingElementType, isElder, SuperBlocks, useComboboxStore, useFloatingStore } from '@mexit/core'

import { useSnippets } from '../../../Hooks/useSnippets'
import { IComboboxItem, SlashCommandConfig } from '../../Types/Combobox'

export const useSlashCommandOnChange = (keys: { [type: string]: SlashCommandConfig }) => {
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const { getSnippetContent } = useSnippets()
  const setFloatingElement = useFloatingStore((s) => s.setFloatingElement)

  return (editor: PlateEditor, item: IComboboxItem) => {
    const targetRange = useComboboxStore.getState().targetRange
    const commandKey = Object.keys(keys).filter((k) => keys[k].command === item.key)[0]
    const commandConfig = keys[commandKey]
    if (targetRange) {
      try {
        if (commandConfig.slateElementType === SuperBlocks.TASK) {
          const data = commandConfig.getData ? commandConfig.getData(item) : { type: commandConfig.slateElementType }
          select(editor, targetRange)
          deleteText(editor)

          insertNodes(editor, data, {
            mode: 'highest',
            select: true
          })

          // setElements(editor, data, {
          //   at: targetRange,
          //   hanging: false,
          //   mode: 'highest'
          // })
        } else if (isElder(commandKey, 'snip')) {
          const content = getSnippetContent(commandConfig.command)

          if (content) {
            select(editor, targetRange)
            insertNodes<TElement>(editor, content)
          }
        } else if (item.key === 'ai') {
          const aiFloatingElement = FloatingElementType.AI_POPOVER
          select(editor, targetRange)
          deleteText(editor)

          setTimeout(() => {
            setFloatingElement(aiFloatingElement, {
              label: camelCase(aiFloatingElement),
              type: aiFloatingElement,
              disableMenu: true
            })
          }, 1)
        } else if (item.key === 'table') {
          select(editor, targetRange)
          insertTable(editor, { rowCount: 3 })
        } else if (item.extended) {
          select(editor, targetRange)
          deleteText(editor)
          const search = useComboboxStore.getState().search

          commandConfig.onExtendedCommand(search.textAfterTrigger, editor)
        } else {
          // console.log('useElementOnChange 2', { type, pathAbove, isBlockEnd });
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
