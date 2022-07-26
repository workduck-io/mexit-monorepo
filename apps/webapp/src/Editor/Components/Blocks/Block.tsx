import React from 'react'

import { BlockType } from '@mexit/core'

import useBlockStore from '../../../Stores/useBlockStore'
import { BlockElement, BlockSelectorInput } from '../../Styles/Block'

type BlockProps = {
  blockId: string
  block: BlockType
  isEmpty?: boolean
  isBlock?: boolean
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
      <BlockSelectorInput type="checkbox" value={isSelected} onClick={handleBlockSelect} />
      {children}
    </BlockElement>
  )
}

export default Block
