import { NodeEditorContent, convertContentToRawText } from '@mexit/core'

import { useContentStore } from '../Stores/useContentStore'

export const getBlocks = (content: NodeEditorContent): Record<string, any> | undefined => {
  if (content) {
    const blocks: Record<string, any> = {}
    let insertOp = false

    content.map((block) => {
      if (block.id) {
        if (!insertOp) insertOp = true
        const desc = convertContentToRawText(block.children)
        blocks[block.id] = { block, desc }
      }
    })

    if (insertOp) return blocks
  }

  return undefined
}

export const getBlock = (nodeid: string, blockId: string) => {
  const nodeContent = useContentStore.getState().getContent(nodeid)

  if (nodeContent?.content) {
    const blocksMap = getBlocks(nodeContent.content)
    if (blocksMap) {
      const blocks = Object.values(blocksMap).map((bd) => bd.block)
      if (!blocks) return undefined

      return blocks.find((b) => {
        return b?.id === blockId
      })
    }
  }

  return undefined
}
