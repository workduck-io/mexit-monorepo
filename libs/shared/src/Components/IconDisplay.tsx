import React from 'react'

import { Icon } from '@iconify/react'

import { MIcon } from '@mexit/core'

import { IconWrapper } from '../Style/IconPicker.style'

interface IconDisplayProps {
  icon: MIcon
  size?: number
  className?: string
}

const resolveIconURL = (value: string) => {
  if (chrome && chrome.runtime) return chrome.runtime.getURL(value)

  return `/value`
}

export const IconDisplay = ({ icon, size, className }: IconDisplayProps) => {
  if (!icon) return null

  return (
    <IconWrapper size={size} className={className}>
      {
        {
          EMOJI: <span>{icon.value}</span>,
          ICON: <Icon icon={icon.value} />,
          URL: <img alt="Icon" src={resolveIconURL(icon.value)} />
        }[icon.type]
      }
    </IconWrapper>
  )
}
