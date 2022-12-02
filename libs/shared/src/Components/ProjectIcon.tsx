import React, { forwardRef } from 'react'

import { MexIcon } from '../Style/Layouts'
import { isUrl } from '@udecode/plate'
import { useTheme } from 'styled-components'

export const getIconType = (icon: string): { mexIcon: boolean; isIconfiy: boolean } => {
  const mexIcon = !isUrl(icon)

  const isIconfiy = mexIcon && icon.includes(':')

  return {
    mexIcon,
    isIconfiy
  }
}

export const DEFAULT_LIST_ITEM_ICON = 'codicon:circle-filled'
export const DEFAULT_IMAGE_URL = 'https://www.gravatar.com/avatar/?r=g&d=identicon'

export const ProjectIconMex: React.FC<{
  isMex?: boolean
  margin?: string
  icon: string
  size?: number
  color?: string
}> = forwardRef((props, ref) => {
  const theme = useTheme()
  // eslint-disable-next-line react/prop-types
  const { isMex, icon, size, color, margin } = props

  if (isMex)
    return (
      <MexIcon
        ref={ref as any}
        icon={icon}
        $noHover
        margin={margin}
        height={size ?? 20}
        width={size ?? 20}
        color={color ?? theme.colors.primary}
      />
    )

  return (
    <img
      alt="ProjectIconMex"
      ref={ref as any}
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = DEFAULT_IMAGE_URL
      }}
      style={{ margin: margin ?? '0' }}
      src={icon}
      height={size ? size : 24}
      width={size ? size : 24}
    />
  )
})

ProjectIconMex.displayName = 'ProjectIconMex'
