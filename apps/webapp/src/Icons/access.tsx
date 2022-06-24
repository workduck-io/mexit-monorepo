import { AccessLevel } from '../../types/mentions'
import React from 'react'
import { Icon } from '@iconify/react'
import adminLine from '@iconify/icons-ri/admin-line'
import eyeLine from '@iconify/icons-ri/eye-line'
import edit2Line from '@iconify/icons-ri/edit-2-line'

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
