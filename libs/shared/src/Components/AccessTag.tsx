import React from 'react'

import { AccessLevel, AccessNames } from '@mexit/core'

import { AccessIcon } from './Access'
import { SAccessTag } from '../Style/Mentions'

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
