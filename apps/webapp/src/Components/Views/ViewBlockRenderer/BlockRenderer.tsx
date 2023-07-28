import { SuperBlocks } from '@mexit/core'

import ContentBlock, { CaptureBlock } from './ContentBlock'
import ImageRenderer from './ImageRenderer'
import TodoRenderer from './TodoRenderer'

type BlockRendererProps = {
  block: any
  type: SuperBlocks
  selectedBlockId: string
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ type, ...rest }) => {
  switch (type) {
    case SuperBlocks.MEDIA:
      return <ImageRenderer {...rest} />
    case SuperBlocks.TASK:
      return <TodoRenderer {...rest} />
    case SuperBlocks.CAPTURE:
      return <CaptureBlock {...rest} />
    case SuperBlocks.HIGHLIGHT:
      return <CaptureBlock {...rest} />
    case SuperBlocks.CONTENT:
    default:
      return <ContentBlock {...rest} />
  }
}

export default BlockRenderer
