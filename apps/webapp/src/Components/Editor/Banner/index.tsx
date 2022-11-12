import React from 'react'

import { IconifyIcon } from '@iconify/react'
import { useTheme } from 'styled-components'

import { MexIcon, TitleText } from '@workduck-io/mex-components'

import { Settify } from '@mexit/core'

import { useAuthStore } from '../../../Stores/useAuth'
import useRouteStore from '../../../Stores/useRouteStore'
import { BannerContainer, Group } from './styled'

type BannerType = {
  icon?: IconifyIcon | string
  iconColor?: string
  title: string
  onClick?: any
  route?: string
  withDetails?: boolean
}

const Banner: React.FC<BannerType> = ({
  icon = 'bxs:info-circle',
  route,
  iconColor,
  title,
  onClick,
  withDetails = true
}) => {
  const theme = useTheme()

  const currentUser = useAuthStore((s) => s.userDetails)
  const activeUsers = useRouteStore((s) => Settify(s.routes[route]?.users))

  const isUserOnly = activeUsers.includes(currentUser?.userID)

  return (
    <BannerContainer>
      <Group>
        <MexIcon icon={icon} color={iconColor ?? theme.colors.primary} height={20} width={20} onClick={onClick} />
        <TitleText>{!isUserOnly ? title : "You've opened this Note somewhere else. Data may get lost!"}</TitleText>
      </Group>
      {/* {layoutChange && withDetails && (
        <Group>
          <AvatarGroups
            margin={`0 ${theme.spacing.medium} 0`}
            users={usersExcludingMe.map((u) => ({ userId: u, active: true }))}
            limit={5}
          />
        </Group>
      )} */}
    </BannerContainer>
  )
}

export default Banner
