import React from 'react'

import { AccessLevel, AccessNames } from '@mexit/core'

import { SAccessTag } from '../Style/Mentions'
import { AccessIcon } from './Access'

interface AccessTagProps {
  access: AccessLevel
}

export const AccessTag = ({ access }: AccessTagProps) => {
  return (
    <SAccessTag>
      <AccessIcon access={access} />
      <span>{AccessNames[access]}</span>
    </SAccessTag>
  )
}
