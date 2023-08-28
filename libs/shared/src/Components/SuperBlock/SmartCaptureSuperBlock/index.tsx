import React from 'react'

import { DefaultMIcons } from '../../Icons'
import { SuperBlock } from '../SuperBlock'
import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'

export const SmartCaptureSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...restProps}
      $isActive={props.isActive}
      $isSelected={props.isSelected}
      $isReadOnly={props.isReadOnly}
      LeftHeaderRenderer={
        <SuperBlockTitle
          type={restProps.type}
          id={restProps.id}
          parent={restProps.id}
          onChange={restProps.onChange}
          heading="Smart Capture"
          value={props.value}
          icon={DefaultMIcons.EDIT}
          isReadOnly={props.isReadOnly}
        />
      }
    >
      {children}
    </SuperBlock>
  )
}
