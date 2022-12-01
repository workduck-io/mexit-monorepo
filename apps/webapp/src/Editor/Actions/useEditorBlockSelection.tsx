import { BlockType, generateTempId, getBlockMetadata,mog, NodeEditorContent, updateIds } from '@mexit/core'

import { defaultContent } from '../../Data/baseData'
import useBlockStore from '../../Stores/useBlockStore'
import { useContentStore } from '../../Stores/useContentStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import {
  deleteText,
  ELEMENT_PARAGRAPH,
  getNodeEntries,
  getPlateEditorRef,
  insertNodes,
  removeNodes,
  TNode,
  TNodeEntry
} from '@udecode/plate'

export const useEditorBlockSelection = () => {
  const blocksFromStore = useBlockStore((store) => store.blocks)

  const getEditorBlocks = (): TNodeEntry<TNode>[] => {
    const nodeId = useEditorStore.getState().node.nodeid
    const editor = getPlateEditorRef()

    const blocks = Object.values(blocksFromStore)
    const blockIter = getNodeEntries(editor, {
      at: [],
      match: (node) => {
        return blocks.find((block) => {
          return block.id === node?.id
        })
      },
      block: true
    })

    const blockEnteries: TNodeEntry<TNode>[] = Array.from(blockIter).map(([block, _path]) => {
      const blockWithMetadata = { ...block, blockMeta: getBlockMetadata(nodeId, block?.blockMeta) }
      mog('Block enteries are', { blockWithMetadata })

      return [updateIds(blockWithMetadata), _path]
    })

    return blockEnteries
  }

  const getContentWithNewBlocks = (nodeid: string, blocks: TNodeEntry<TNode>[], isAppend = true): NodeEditorContent => {
    const blocksContent = blocks.map(([block, _path]) => block)

    if (!isAppend) return blocksContent

    const content = useContentStore.getState().getContent(nodeid)
    return [...(content?.content ?? defaultContent.content), ...blocksContent]
  }

  const deleteContentBlocks = (blocks: TNodeEntry<TNode>[]): void => {
    const editor = getPlateEditorRef()
    const selection = editor?.selection

    if (blocks.length) {
      blocks.forEach(([block, path], index) => {
        const at = path[0] - index === -1 ? 0 : path[0] - index
        deleteText(editor, { at: [at] })
      })
    } else if (selection) {
      removeNodes(editor, { at: selection })
    }

    const isEmpty = editor.children.length === 0

    if (isEmpty)
      insertNodes(editor, { type: ELEMENT_PARAGRAPH, id: generateTempId(), children: [{ text: '' }] }, { at: [0] })
  }

  const deleteSelectedBlock = (deleteBlock?: boolean): any => {
    const editorBlocks = getEditorBlocks()
    if (deleteBlock) deleteContentBlocks(editorBlocks)
    return editorBlocks
  }

  const convertToBlocks = () => {
    const editor = getPlateEditorRef()

    const nodes = Array.from(
      getNodeEntries(editor, {
        mode: 'highest',
        block: true,
        at: editor.selection
      })
    )

    const value = nodes.map(([node, _path]) => {
      return node
    })

    const blocks = value.reduce((prev: Record<string, BlockType>, current: BlockType) => {
      prev[current.id] = current
      return prev
    }, {})
    return blocks
  }

  return {
    getEditorBlocks,
    getContentWithNewBlocks,
    deleteContentBlocks,
    convertToBlocks,
    deleteSelectedBlock
  }
}
