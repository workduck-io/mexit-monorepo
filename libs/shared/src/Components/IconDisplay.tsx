import React from 'react'

import { Icon } from '@iconify/react'

import { MIcon } from '@mexit/core'

import { IconWrapper } from '../Style/IconPicker.style'

interface IconDisplayProps {
  icon: MIcon
  size?: number
}

export const IconDisplay = ({ icon, size }: IconDisplayProps) => {
  if (!icon) return

  return (
    <IconWrapper size={size}>
      {
        {
          EMOJI: <span>{icon.value}</span>,
          ICON: <Icon icon={icon.value} />,
          URL: <img src={icon.value} />
        }[icon.type]
      }
    </IconWrapper>
  )
}
