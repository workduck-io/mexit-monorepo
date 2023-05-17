import React from 'react'

import { Icon } from '@iconify/react'

import { MIcon } from '@mexit/core'

import { IconWrapper } from '../Style/IconPicker.style'
import { WDLogo } from '../Utils/Logo'

import { DEFAULT_IMAGE_URL } from './ProjectIcon'

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
      return (
        <img
          alt="Icon"
          className="mexit-icon-image"
          src={resolveIconURL(value)}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.onerror = null
            e.currentTarget.src = DEFAULT_IMAGE_URL
            e.currentTarget.style.display = 'block'
            e.currentTarget.style.borderRadius = '8px'
            e.currentTarget.style.height = '32px'
            e.currentTarget.style.width = '32px'
          }}
        />
      )
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
