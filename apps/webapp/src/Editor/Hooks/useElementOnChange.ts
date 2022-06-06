import { ELEMENT_ILINK, ELEMENT_INLINE_BLOCK, getSlug, NODE_ID_PREFIX, QuickLinkType } from '@mexit/core'
import { getBlockAbove, getPluginType, insertNodes, PlateEditor, TElement } from '@udecode/plate'
import { Editor, Transforms } from 'slate'
import { useLinks } from '../../Hooks/useLinks'

import { useComboboxStore } from '../../Stores/useComboboxStore'
import { ComboboxItemType, IComboboxItem } from '../Types/Combobox'

export const useElementOnChange = (elementComboType: ComboboxItemType, keys?: Array<any>) => {
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

          console.log('Inserting Node: ', withBlockInfo)

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
        Transforms.move(editor)

        // delete the inserted space
        if (isBlockEnd) {
          Transforms.delete(editor)
        }

        return closeMenu()
      }
    } catch (e) {
      console.error(e)
    }
    return undefined
  }
}
