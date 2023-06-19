import { Value } from '@udecode/plate'

import { SuperBlockProps } from './SuperBlock.types'
import { SuperBlock } from '.'

const ContentSuperBlock = <V extends Value>(props: SuperBlockProps<V>) => {
  return <SuperBlock>{props.children}</SuperBlock>
}

export default ContentSuperBlock
