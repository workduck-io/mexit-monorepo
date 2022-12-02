import React from 'react'

import { AccessLevel } from '@mexit/core'

import adminLine from '@iconify/icons-ri/admin-line'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import eyeLine from '@iconify/icons-ri/eye-line'
import { Icon } from '@iconify/react'

interface AccessIconProps {
  access: AccessLevel
}

const accessIcons = {
  ADMIN: <Icon icon={adminLine} />,
  READ: <Icon icon={eyeLine} />,
  WRITE: <Icon icon={edit2Line} />
}

export const AccessIcon = ({ access }: AccessIconProps) => {
  if (accessIcons[access]) return accessIcons[access]
  return null
}

export const sharedAccessIcon: Record<AccessLevel, string> = {
  READ: 'bi:eye-fill',
  WRITE: 'fa-solid:user-edit',
  MANAGE: 'fa6-solid:user-lock',
  OWNER: 'fa:user'
}
