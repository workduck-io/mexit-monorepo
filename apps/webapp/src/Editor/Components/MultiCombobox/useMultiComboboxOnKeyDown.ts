import { getBlockAbove, getPluginType, insertNodes, PEditor, PlateEditor, TElement } from '@udecode/plate'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

import { getSlug, NODE_ID_PREFIX } from '@mexit/core'

import { useLinks } from '../../../Hooks/useLinks'
import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { ELEMENT_ILINK, ELEMENT_INLINE_BLOCK } from '@mexit/core'
import { isInternalCommand, useComboboxOnKeyDown } from '../../Hooks/useComboboxOnKeyDown'
import { ComboboxKey, IComboboxItem } from '../../Types/Combobox'
import {
  ComboConfigData,
  ComboSearchType,
  ConfigDataSlashCommands,
  SingleComboboxConfig
} from '../../Types/MultiCombobox'
import { useSlashCommandOnChange } from '../SlashCommands/useSlashCommandOnChange'
import { QuickLinkType } from '../../constants'

export interface ComboTypeHandlers {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?) => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const useElementOnChange = (elementComboType: SingleComboboxConfig, keys?: any) => {
  const { getNodeidFromPath } = useLinks()
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  return (editor: PlateEditor, item: IComboboxItem, elementType?: string) => {
    try {
      let comboType = elementComboType
      if (keys) {
        const comboboxKey: string = useComboboxStore.getState().key
        comboType = keys[comboboxKey]
      }

      const targetRange = useComboboxStore.getState().targetRange
      // mog('Target Range', { targetRange })

      // mog('ELEMENT', { elementType, comboType })

      const type =
        elementType ??
        getPluginType(editor, comboType.slateElementType === 'internal' ? 'ilink' : comboType.slateElementType)

      if (targetRange) {
        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && Editor.isEnd(editor, editor.selection.anchor, pathAbove)

        // insert a space to fix the bug
        if (isBlockEnd) {
          Transforms.insertText(editor, ' ')
        }

        let itemValue = item.text

        if ((type === ELEMENT_ILINK || type === ELEMENT_INLINE_BLOCK) && !itemValue.startsWith(`${NODE_ID_PREFIX}_`)) {
          // mog('Replacing itemValue', { comboType, type, itemValue, item })

          const nodeId = getNodeidFromPath(itemValue)
          itemValue = nodeId
        }

        // select the ilink text and insert the ilink element
        Transforms.select(editor, targetRange)
        // mog('Inserting Element', { comboType, type, itemValue, item })

        const isBlockTriggered = useComboboxStore.getState().isBlockTriggered
        const activeBlock = useComboboxStore.getState().activeBlock

        // mog('Inserting from here', { activeBlock, isBlockTriggered })
        if (
          (item.type === QuickLinkType.backlink || type === ELEMENT_INLINE_BLOCK) &&
          isBlockTriggered &&
          activeBlock
        ) {
          const blockValue = activeBlock?.text ? getSlug(activeBlock.text) : ''
          const withBlockInfo = {
            type,
            children: [{ text: '' }],
            value: activeBlock?.id,
            blockValue,
            blockId: activeBlock?.blockId
          }

          insertNodes(editor, withBlockInfo)
        } else {
          if (item.type === QuickLinkType.snippet) {
            itemValue = item.key
          }

          insertNodes<TElement>(editor, {
            type,
            children: [{ text: '' }],
            value: itemValue
          })
        }

        // move the selection after the ilink element
        Transforms.move(editor)

        // delete the inserted space
        if (isBlockEnd) {
          Transforms.delete(editor)
        }

        // return true
        return closeMenu()
      }
    } catch (e) {
      console.error(e)
    }
    return undefined
  }
}

export const useOnSelectItem = (
  comboboxKey: string,
  slashCommands: ConfigDataSlashCommands,
  singleComboConfig: SingleComboboxConfig,
  commands: ConfigDataSlashCommands
) => {
  const slashCommandOnChange = useSlashCommandOnChange({ ...slashCommands, ...commands })
  const elementOnChange = useElementOnChange(singleComboConfig)

  const search: ComboSearchType = useComboboxStore.getState().search
  const isSlashTrigger = useComboboxStore((store) => store.isSlash)
  const isSlash =
    isSlashTrigger ||
    comboboxKey === ComboboxKey.SLASH_COMMAND ||
    (comboboxKey === ComboboxKey.INTERNAL && isInternalCommand(search.textAfterTrigger))

  let elementChangeHandler: (editor: PEditor & ReactEditor, item: IComboboxItem) => any

  if (isSlash) {
    elementChangeHandler = slashCommandOnChange
  } else {
    elementChangeHandler = elementOnChange
  }
  return { elementChangeHandler, isSlash }
}

const useMultiComboboxOnKeyDown = (config: ComboConfigData) => {
  return useComboboxOnKeyDown(config)
}

export default useMultiComboboxOnKeyDown
