import React from 'react'

import { Icon } from '@iconify/react'

import { MIcon } from '@mexit/core'

import { IconWrapper } from '../Style/IconPicker.style'
import { WDLogo } from '../Utils/Logo'

interface IconDisplayProps {
  icon: MIcon
  size?: number
  className?: string
  isLoading?: boolean
  color?: string
}

const resolveIconURL = (value: string) => {
  if (chrome && chrome.runtime) return chrome.runtime.getURL(value)

  return `/${value}`
}

const IconItem = ({ type, value }) => {
  switch (type) {
    case 'EMOJI':
      return <span>{value}</span>
    case 'ICON':
      return <Icon icon={value} />
    case 'URL':
      return <img alt="Icon" src={resolveIconURL(value)} />
    case 'MEX':
      return <WDLogo />
    default:
      break
  }
}

export const IconDisplay = ({ icon, size, isLoading, className, color }: IconDisplayProps) => {
  if (!icon) return null
  return (
    <IconWrapper isLoading={isLoading} size={size} className={className} color={color}>
      <IconItem {...icon} />
    </IconWrapper>
  )
}
