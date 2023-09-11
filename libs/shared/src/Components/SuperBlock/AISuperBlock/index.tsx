import React from 'react'

import { StyledButton } from '../../../Style/Buttons'
import { DefaultMIcons } from '../../Icons'
import { SuperBlock } from '../SuperBlock'
import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'

export const AISuperBlock: React.FC<SuperBlockProps> = (props) => {
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
          heading="Outreach"
          value={restProps.value}
          icon={DefaultMIcons.HIGHLIGHT}
          isReadOnly={props.isReadOnly}
        />
      }
      FooterRightComponent={AISuperBlockActions}
    >
      {children}
    </SuperBlock>
  )
}

export const AISuperBlockActions = ({ content }) => {
  const onClick = () => {
    console.log('summarize')
  }
  return <StyledButton onClick={onClick}>Generate</StyledButton>
}