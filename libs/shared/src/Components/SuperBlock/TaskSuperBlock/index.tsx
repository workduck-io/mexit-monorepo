import React from 'react'

import { DefaultMIcons } from '../../Icons'
import { SuperBlock } from '../SuperBlock'
import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'

import { TaskSuperBlockFooter } from './TaskSuperBlockFooter'

export const TaskSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...(restProps as any)}
      $isActive={props.isActive}
      $isSelected={props.isSelected}
      $isReadOnly={props.isReadOnly}
      LeftHeaderRenderer={
        <SuperBlockTitle
          id={restProps.id}
          parent={restProps.parent}
          onChange={restProps.onChange}
          type={restProps.type}
          icon={DefaultMIcons.TASK}
          heading="Task"
          isReadOnly={props.isReadOnly}
          value={props.value}
        />
      }
      FooterRightComponent={TaskSuperBlockFooter}
    >
      {children}
    </SuperBlock>
  )
}
