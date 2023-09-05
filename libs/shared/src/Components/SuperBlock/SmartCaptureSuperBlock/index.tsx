import React from 'react'

import { DefaultMIcons } from '../../Icons'
import { SuperBlock } from '../SuperBlock'
import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'

import { ContactCard } from './Contact'
import ContactActions from './ContactActions'

export const SmartCaptureSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  const contact = props.value.template?.['contact']?.reduce((acc, curr) => {
    if (curr.field) acc[curr.field] = curr.value
    return acc
  }, {})

  return (
    <SuperBlock
      {...restProps}
      $isActive
      $isSelected
      $isReadOnly={props.isReadOnly}
      LeftHeaderRenderer={
        <SuperBlockTitle
          type={restProps.type}
          id={restProps.id}
          parent={restProps.parent}
          onChange={restProps.onChange}
          heading="Smart Capture"
          value={props.value}
          icon={DefaultMIcons.EDIT}
          isReadOnly={props.isReadOnly}
        />
      }
      FooterRightComponent={ContactActions}
    >
      <ContactCard contact={contact} />
      {children}
    </SuperBlock>
  )
}
