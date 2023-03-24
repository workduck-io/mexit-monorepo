import React, { ReactNode } from 'react'

import { BlockType, useBlockStore } from '@mexit/core'

import { BlockElement, BlockSelectorInput } from '../../Styles/Block'

type BlockProps = {
  blockId: string
  block: BlockType
  isEmpty?: boolean
  isBlock?: boolean
  children?: ReactNode
}

const Block: React.FC<BlockProps> = ({ children, blockId, block }) => {
  const [isSelected, setIsSelected] = React.useState(0)
  const addBlock = useBlockStore((store) => store.addBlock)
  const deleteBlock = useBlockStore((store) => store.deleteBlock)

  const handleBlockSelect = () => {
    if (!isSelected) {
      setIsSelected(1)
      addBlock(blockId, block)
    } else {
      setIsSelected(0)
      deleteBlock(blockId)
    }
  }

  return (
    <BlockElement contentEditable={false} id={blockId}>
      <BlockSelectorInput
        key={`is-selected-${blockId}-${isSelected}`}
        type="checkbox"
        checked={Boolean(isSelected)}
        onChange={handleBlockSelect}
      />
      {children}
    </BlockElement>
  )
}

export default Block
