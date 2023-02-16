import { Entities } from '@workduck-io/mex-search/src/utils'

import ContentBlock from './ContentBlock'
import TodoRenderer from './TodoRenderer'

type BlockRendererProps = {
  block: any
  type: Entities
  selectedBlockId: string
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ type, ...rest }) => {
  console.log('CONTENT', { type, ...rest })

  switch (type) {
    case Entities.CONTENT_BLOCK:
      return <ContentBlock {...rest} />
    case Entities.TASK:
      return <TodoRenderer {...rest} />
    default:
      return <ContentBlock {...rest} />
  }
}

export default BlockRenderer
