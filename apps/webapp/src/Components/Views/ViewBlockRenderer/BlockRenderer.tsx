import { Entities } from '@workduck-io/mex-search/src/utils'

import ContentBlock from './ContentBlock'
import TodoRenderer from './TodoRenderer'

type BlockRendererProps = {
  block: any
  type: Entities
  selectedBlockId: string
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ type, ...rest }) => {
  switch (type) {
    case Entities.TASK:
      return <TodoRenderer {...rest} />
    case Entities.CONTENT_BLOCK:
    default:
      return <ContentBlock {...rest} />
  }
}

export default BlockRenderer