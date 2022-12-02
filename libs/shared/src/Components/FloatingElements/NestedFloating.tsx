import React from 'react'

import { Floating } from './Floating'
import { Props } from './types'
import { FloatingTree, useFloatingParentNodeId } from '@floating-ui/react-dom-interactions'

export const NestedFloating: React.FC<Props> = (props) => {
  const parentId = useFloatingParentNodeId()

  if (parentId == null) {
    return (
      <FloatingTree>
        <Floating {...props} />
      </FloatingTree>
    )
  }

  return <Floating {...props} />
}
