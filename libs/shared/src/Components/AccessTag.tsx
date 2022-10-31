import React from 'react'

import { AccessLevel } from '@mexit/core'
import { AccessNames } from '@mexit/core'
import { SAccessTag } from '@mexit/shared'

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
