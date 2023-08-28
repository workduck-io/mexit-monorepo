import React from 'react'

import { DefaultMIcons } from '../../Icons'
import { SuperBlock } from '../SuperBlock'
import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'

export const ContentSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...restProps}
      $isActive={restProps.isActive}
      $isSelected={restProps.isSelected}
      $isReadOnly={restProps.isReadOnly}
      LeftHeaderRenderer={
        <SuperBlockTitle
          id={restProps.id}
          parent={restProps.parent}
          type={restProps.type}
          onChange={restProps.onChange}
          icon={DefaultMIcons.NOTE}
          heading="Content"
          value={restProps.value}
          isReadOnly={restProps.isReadOnly}
        />
      }
    >
      {children}
    </SuperBlock>
  )
}
