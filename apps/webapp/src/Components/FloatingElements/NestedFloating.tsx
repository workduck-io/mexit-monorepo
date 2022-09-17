import React from 'react'
import { FloatingTree, useFloatingParentNodeId } from '@floating-ui/react-dom-interactions'
import { Props } from './types'
import { Floating } from './Floating'

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
