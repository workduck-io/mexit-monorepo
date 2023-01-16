import {
  deleteText,
  deserializeMd,
  getBlockAbove,
  getPluginType,
  insertNodes,
  insertText,
  isBlock,
  isEndPoint,
  moveSelection,
  PlateEditor,
  select,
  TElement,
  Value
} from '@udecode/plate'

import {
  ELEMENT_ILINK,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_LINK,
  ELEMENT_TASK_VIEW_BLOCK,
  ELEMENT_TASK_VIEW_LINK,
  getSlug,
  NODE_ID_PREFIX,
  PromptRenderType
} from '@mexit/core'

import { useComboboxStore } from '../../../Stores/useComboboxStore'
import { usePromptStore } from '../../../Stores/usePromptStore'
import { QuickLinkType } from '../../constants'
import { isInternalCommand, useComboboxOnKeyDown } from '../../Hooks/useComboboxOnKeyDown'
import { ComboboxKey, IComboboxItem, InsertableElement } from '../../Types/Combobox'
import {
  ComboConfigData,
  ComboSearchType,
  ConfigDataSlashCommands,
  SingleComboboxConfig
} from '../../Types/MultiCombobox'
import { useSlashCommandOnChange } from '../SlashCommands/useSlashCommandOnChange'

export interface ComboTypeHandlers {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?) => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const handleOnTab = (item, itemType): boolean => {
  switch (itemType.type) {
    case ELEMENT_ILINK:
      itemType.type = ELEMENT_INLINE_BLOCK
      return false
    case ELEMENT_TASK_VIEW_LINK:
      itemType.type = ELEMENT_TASK_VIEW_BLOCK
      return false
    case PromptRenderType:
      return true
    default:
      return false
  }
}

const getInternalItemType = (item, triggerType) => {
  if (triggerType !== 'internal') return triggerType

  switch (item.type) {
    case QuickLinkType.prompts:
      return PromptRenderType
    default:
      return ELEMENT_ILINK
  }
}

export const useElementOnChange = (elementComboType: SingleComboboxConfig, keys?: any) => {
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  return (editor: PlateEditor, item: IComboboxItem, elementType?: string, tab?: boolean) => {
    try {
      let comboType = elementComboType
      if (keys) {
        const comboboxKey: string = useComboboxStore.getState().key
        comboType = keys[comboboxKey]
      }

      const targetRange = useComboboxStore.getState().targetRange

      const internalItemType = {
        type: elementType ?? getPluginType(editor, getInternalItemType(item, comboType.slateElementType))
      }

      if (tab) {
        const response = handleOnTab(item, internalItemType)
        if (response) return
      }

      const type = internalItemType.type

      if (targetRange) {
        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && isEndPoint(editor, editor.selection.anchor, pathAbove)

        // insert a space to fix the bug
        if (isBlockEnd) {
          insertText(editor, ' ')
        }

        let itemValue = item.text

        if ((type === ELEMENT_ILINK || type === ELEMENT_INLINE_BLOCK) && !itemValue?.startsWith(`${NODE_ID_PREFIX}_`)) {
          // mog('Replacing itemValue', { comboType, type, itemValue, item })
          const nodeId = item.key // getNodeidFromPath(itemValue, namespace.id)
          itemValue = nodeId
          // mog('Value of Item', { itemValue })
        }

        // select the ilink text and insert the ilink element
        select(editor, targetRange)
        // mog('Inserting Element', { comboType, type, itemValue, item })

        const isBlockTriggered = useComboboxStore.getState().isBlockTriggered
        const activeBlock = useComboboxStore.getState().activeBlock

        let InsertedElement: InsertableElement = {
          type,
          children: [{ text: '' }],
          value: itemValue ?? item.key
        }
        const itemType = item.type as unknown as QuickLinkType

        if ((itemType === QuickLinkType.backlink || type === ELEMENT_INLINE_BLOCK) && isBlockTriggered && activeBlock) {
          const blockValue = activeBlock?.text ? getSlug(activeBlock.text) : ''
          InsertedElement = {
            ...InsertedElement,
            type,
            children: [{ text: '' }],
            value: activeBlock?.id,
            blockValue,
            blockId: activeBlock?.blockId
          }
        } else if (itemType === QuickLinkType.webLinks) {
          InsertedElement = {
            type: ELEMENT_LINK,
            url: item.key,
            children: [{ text: item.text }]
          }
        } else if (itemType === QuickLinkType.prompts) {
          const resultIndex = usePromptStore.getState().resultIndexes[item.key]
          const promptResult = usePromptStore.getState().results[item.key]?.at(resultIndex)?.at(0)
          const data = deserializeMd(editor, promptResult)
          select(editor, targetRange)
          InsertedElement = data
        } else if (itemType === QuickLinkType.mentions) {
          InsertedElement = {
            ...InsertedElement,
            value: item.key
          }
          if (comboType.onItemInsert && tab !== true) comboType.onItemInsert(item.text)
        } else if (itemType === QuickLinkType.taskView) {
          InsertedElement = {
            ...InsertedElement,
            type: ELEMENT_TASK_VIEW_LINK,
            value: item.key
          }
          if (tab === true) {
            InsertedElement = {
              ...InsertedElement,
              type: ELEMENT_TASK_VIEW_BLOCK,
              value: item.key
            }
          }
        } else {
          if (itemType === QuickLinkType.snippet) {
            itemValue = item.key
          }

          InsertedElement = {
            ...InsertedElement,
            value: itemValue
          }
        }

        if (item.additional) {
          InsertedElement = { ...InsertedElement, ...item.additional }
        }

        // mog('Inserting', { InsertedElement })

        insertNodes<TElement>(editor, InsertedElement)

        // move the selection after the ilink element
        moveSelection(editor)

        const isBlockComponent = isBlock(editor, InsertedElement)

        if (isBlockEnd && !isBlockComponent && itemType !== QuickLinkType.webLinks) {
          // delete the inserted space
          console.log('DELETING...')
          deleteText(editor, { unit: 'character', reverse: true })
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

  let elementChangeHandler: (editor: PlateEditor<Value>, item: IComboboxItem) => any

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
