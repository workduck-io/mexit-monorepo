import React, { useEffect, useState } from 'react'
import md5 from 'md5'
import Avatar from 'boring-avatars'
import Tippy from '@tippyjs/react/headless' // different import path!
import { Icon } from '@iconify/react'
import user3Line from '@iconify-icons/ri/user-3-line'
import styled, { useTheme } from 'styled-components'

import { Centered, CardShadow } from '@mexit/shared'
import { useAuthStore } from '../../Stores/useAuth'

interface ProfileImageProps {
  userId: string
  size: number
}

const protocol = 'https://'
const domain = 'www.gravatar.com'
const base = `${protocol}${domain}/avatar/`

const ProfileTooptip = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  ${CardShadow}
  background: ${({ theme }) => theme.colors.gray[8]} !important;
  color: ${({ theme }) => theme.colors.text.default};
  &::after {
    border-right-color: ${({ theme }) => theme.colors.primary} !important;
  }
`

export const ProfileImage = ({ email, size }: ProfileImageProps) => {
  // 0 => not fetched yet
  // 1 => found
  // -1 => not found
  const [gravState, setGravState] = useState(0)

  const theme = useTheme()
  const colors = theme.additional.profilePalette

  const params = {
    s: size.toString(),
    r: 'pg',
    d: '404'
  }
  const query = new URLSearchParams(params)
  // Gravatar service currently trims and lowercases all registered emails
  const formattedEmail = ('' + email).trim().toLowerCase()
  const hash = md5(formattedEmail, { encoding: 'binary' })
  const src = `${base}${hash}?${query.toString()}`

  useEffect(() => {
    // Check if the gravatar exists
    const img = new Image()
    img.src = src
    img.onload = () => {
      setGravState(1) // It does
    }
    img.onerror = () => {
      setGravState(-1) // It doesn't
    }
  }, [email])

  if (gravState === 1) return <img src={src} alt={email ? `Gravatar for ${formattedEmail}` : 'Gravatar'} />

  if (gravState === -1) return <Avatar size={size} square name={email} colors={colors} variant="beam" />
  // Rendered if both fail
  return <Icon className="defaultProfileIcon" icon={user3Line} height={size} />
}

interface ProfileImageWithToolTipProps {
  props: ProfileImageProps
  placement?: string
}

export const ProfileImageWithToolTip = ({ props, placement }: ProfileImageWithToolTipProps) => {
  const { userId } = props // eslint-disable-line react/prop-types

  // *TODO: Remove this after adding mentions, use userId to get user information
  const user = useAuthStore((store) => store.userDetails)

  return (
    <Tippy
      delay={100}
      interactiveDebounce={100}
      placement={(placement as any) ?? 'auto'}
      appendTo={() => document.body}
      render={(attrs) => (
        <ProfileTooptip tabIndex={-1} {...attrs}>
          {user?.email || ''}
        </ProfileTooptip>
      )}
    >
      <Centered>
        <ProfileImage {...props} />
      </Centered>
    </Tippy>
  )
}
