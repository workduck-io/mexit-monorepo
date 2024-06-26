import { useMemo } from 'react'

import { findNodePath, usePlateEditorRef } from '@udecode/plate'
import { createNodesHOC } from '@udecode/plate-core'

import { BlockType, useBlockStore } from '@mexit/core'

import { BlockOptionProps } from '../../Types/Block'

import Block from './Block'

const BlockOptions = (props: BlockOptionProps) => {
  const { children, element } = props

  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const editor = usePlateEditorRef()

  const isBlock = useMemo(() => {
    const isThisBlock = element && editor && findNodePath(editor, element)?.length === 1

    return isThisBlock
  }, [editor, element, isBlockMode])

  if (!element || !isBlockMode || !isBlock) return children

  return (
    <Block blockId={element?.id} block={element as BlockType}>
      {children}
    </Block>
  )
}

export default BlockOptions

export const withBlockOptions = createNodesHOC(BlockOptions)
