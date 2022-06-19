import React from 'react'
import { AccessNames } from '../../Data/defaultMentions'
import { AccessLevel } from '../../Types/Mentions'
import { AccessIcon } from '../Icons/Access'
// import { SAccessTag } from '@editor/Components/mentions/components/MentionElement.styles'

interface AccessTagProps {
  access: AccessLevel
}

const AccessTag = ({ access }: AccessTagProps) => {
  return (
    <SAccessTag>
      <AccessIcon access={access} />
      <span>{AccessNames[access]}</span>
    </SAccessTag>
  )
}

export default AccessTag
