import React from 'react'

import { DefaultMIcons } from '../../Icons'
import { SuperBlock } from '../SuperBlock'
import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'

import { Meet, MeetActions } from './Meet'

export const MeetSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...restProps}
      $isActive={restProps.isActive}
      $isSelected={restProps.isSelected}
      $isReadOnly={props.isReadOnly}
      LeftHeaderRenderer={
        <SuperBlockTitle
          id={restProps.id}
          parent={restProps.parent}
          type={restProps.type}
          onChange={restProps.onChange}
          heading="Meet"
          value={restProps.value}
          icon={DefaultMIcons.HIGHLIGHT}
          isReadOnly={props.isReadOnly}
        />
      }
      FooterRightComponent={MeetActions}
    >
      <Meet />
      {children}
    </SuperBlock>
  )
}
