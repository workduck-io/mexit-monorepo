import React, { useEffect, useState } from 'react'

import { Icon } from '@iconify/react'
import user3Line from '@iconify-icons/ri/user-3-line'
import Avatar from 'boring-avatars'
import ColorScheme from 'color-scheme'
import md5 from 'md5'

import { useRequestCacheStore } from '@mexit/core'

interface ProfileImageProps {
  email: string
  size: number
  // Component to replace the default image
  DefaultFallback?: React.ComponentType
}

const protocol = 'https://'
const domain = 'www.gravatar.com'
const base = `${protocol}${domain}/avatar/`

export const ProfileImage = ({ email, size, DefaultFallback }: ProfileImageProps) => {
  // 0 => not fetched yet
  // 1 => found
  // -1 => not found
  const [gravState, setGravState] = useState(0)

  const root = getComputedStyle(document.body)
  const primaryColor = root.getPropertyValue('--theme-tokens-colors-primary-default').trim()

  const colors = primaryColor
    ? new ColorScheme()
        .from_hex(primaryColor.slice(1))
        .scheme('analogic')
        .distance(0.25)
        .variation('light')
        .add_complement(true)
        .colors()
        .map((s) => `#${s}`)
    : undefined

  const addGravatarAbsent = useRequestCacheStore((store) => store.addGravatarAbsent)

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
    const gravatarAbsent = useRequestCacheStore.getState().gravatarAbsent
    // mog('grabbing gravatar for', { email, src, formattedEmail, gravatarAbsent })
    if (gravatarAbsent.includes(email)) {
      setGravState(-1)
      return
    }
    // Check if the gravatar exists
    const img = new Image()
    img.src = src
    img.onload = () => {
      setGravState(1) // It does
    }
    img.onerror = () => {
      // mog('gravatar not found', { email, src, formattedEmail })
      addGravatarAbsent(email)
      setGravState(-1) // It doesn't
    }
  }, [email])

  if (gravState === 1) return <img src={src} alt={email ? `Gravatar for ${formattedEmail}` : 'Gravatar'} />
  if (DefaultFallback !== undefined) return <DefaultFallback />
  if (gravState === -1 && colors) return <Avatar size={size} square name={email} colors={colors} variant="beam" />

  // Rendered if both fail
  return <Icon className="defaultProfileIcon" icon={user3Line} height={size} />
}
