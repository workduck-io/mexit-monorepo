import React from 'react'

import { MIcon } from '@mexit/core'

import { IconWrapper } from '../Style/IconPicker.style'
import { Icon } from '@iconify/react'

interface IconDisplayProps {
  icon: MIcon
  size?: number
}

export const IconDisplay = ({ icon, size }: IconDisplayProps) => {
  if (!icon) return null

  return (
    <IconWrapper size={size}>
      {
        {
          EMOJI: <span>{icon.value}</span>,
          ICON: <Icon icon={icon.value} />,
          URL: <img alt="Icon" src={icon.value} />
        }[icon.type]
      }
    </IconWrapper>
  )
}
