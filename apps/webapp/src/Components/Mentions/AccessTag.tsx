import React from 'react'

import { AccessLevel } from '@mexit/core'

import { AccessNames } from '../../Data/defaultMentions'
import { AccessIcon } from '../Icons/Access'
import { SAccessTag } from '@mexit/shared'

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
