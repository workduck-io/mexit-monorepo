import {
  ELEMENT_PARAGRAPH,
  TNode,
  insertNodes,
  deleteText,
  getNodeEntries,
  getPlateEditorRef,
  removeNodes,
  TNodeEntry
} from '@udecode/plate'

import { mog, updateIds, NodeEditorContent, generateTempId, BlockType, BlockMetaDataType } from '@mexit/core'

import { defaultContent } from '../../Data/baseData'
import useBlockStore from '../../Stores/useBlockStore'
import { useContentStore } from '../../Stores/useContentStore'
import { useEditorStore } from '../../Stores/useEditorStore'

export const getBlockMetadata = (text: string, meta?: BlockMetaDataType): BlockMetaDataType => {
  const metadata = meta || {}

  // * Origin of the block
  if (!metadata?.origin) return { ...metadata, source: text, origin: text }

  return { ...metadata, source: text }
}

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

  const deleteSelectedBlock = (): any => {
    const editorBlocks = getEditorBlocks()
    deleteContentBlocks(editorBlocks)
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
