// different import path!
import React, { useEffect, useMemo, useState } from 'react'

import Tippy from '@tippyjs/react/headless'

import { AccessLevel, mog } from '@mexit/core'
import { Centered, ProfileImage } from '@mexit/shared'

import { MentionTooltipComponent } from '../../Editor/Components/Mentions/MentionElement'
import { useUserService } from '../../Hooks/API/useUserAPI'
import { useMentions } from '../../Hooks/useMentions'

interface ProfileImageProps {
  email: string
  size: number
  // Component to replace the default image
  DefaultFallback?: React.ComponentType
}

interface ProfileImageTooltipProps {
  userid: string
  size: number
  access?: AccessLevel
  // Component to replace the default image
  DefaultFallback?: React.ComponentType
}

interface ProfileImageWithToolTipProps {
  props: ProfileImageTooltipProps
  placement?: string
  interactive?: boolean
}

export const ProfileAvatar: React.FC<{ userId: string; size: number }> = ({ userId, size }) => {
  const { getUserFromUserid } = useMentions()
  const { getUserDetailsUserId } = useUserService()

  const user = useMemo(() => {
    const u = getUserFromUserid(userId)
    if (u) return u
    else {
      getUserDetailsUserId(userId)
        .then((d) => mog('GOT userId', { d }))
        .catch((err) => mog('GOT ERROR', { err }))
    }
  }, [userId])

  return <ProfileImage size={size} email={user?.email} />
}

export const ProfileImageWithToolTip = ({ props, placement, interactive }: ProfileImageWithToolTipProps) => {
  const { userid, size, DefaultFallback, access } = props // eslint-disable-line react/prop-types
  const { getUserFromUserid } = useMentions()
  const { getUserDetailsUserId } = useUserService()

  const [user, setUser] = useState<any>()

  useEffect(() => {
    const u = getUserFromUserid(userid)
    if (u) setUser(u)
    else {
      getUserDetailsUserId(userid)
        .then((d) => {
          mog('GOT USERID', { d })
          setUser(d)
        })
        .catch((err) => mog('GOT ERROR', { err }))
    }
  }, [userid])

  return (
    <Tippy
      delay={100}
      interactiveDebounce={100}
      interactive={interactive}
      placement={(placement as any) ?? 'auto'}
      appendTo={() => document.body}
      render={(attrs) => <MentionTooltipComponent user={user} access={access} hideAccess={!access} />}
    >
      <Centered>
        <ProfileImage size={size} email={user?.email} DefaultFallback={DefaultFallback} />
      </Centered>
    </Tippy>
  )
}
