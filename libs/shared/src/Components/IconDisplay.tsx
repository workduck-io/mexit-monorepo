import React from 'react'

import { Icon } from '@iconify/react'

import { MIcon } from '@mexit/core'

import { IconWrapper } from '../Style/IconPicker.style'
import { WDLogo } from '../Utils/Logo'

import { ProfileImage } from './ProfileImage'
import { DEFAULT_IMAGE_URL } from './ProjectIcon'

interface IconDisplayProps {
  icon: MIcon
  size?: number
  className?: string
  isLoading?: boolean
  color?: string
  opacity?: number
  onClick?: any
  cursor?: boolean
}

const resolveIconURL = (value: string) => {
  if (chrome && chrome?.runtime && !value?.startsWith('http')) return chrome.runtime.getURL(value)

  return value
}

const IconItem: React.FC<{ type: string; value: string; size?: number }> = ({ type, value, size }) => {
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
            e.currentTarget.style.height = `${size}32px`
            e.currentTarget.style.width = `${size}32px`
          }}
        />
      )
    case 'MEX':
      return <WDLogo />

    case 'AVATAR':
      return <ProfileImage email={value} size={32} />
    default:
      break
  }
}

export const IconDisplay = ({ icon, size, ...rest }: IconDisplayProps) => {
  if (!icon) return null

  return (
    <IconWrapper {...rest} size={size} type={icon.type}>
      <IconItem {...icon} size={size} />
    </IconWrapper>
  )
}
