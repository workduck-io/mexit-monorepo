import React from 'react'
import linkM from '@iconify/icons-ri/link-m'
import { Link } from '../../Stores/useLinkStore'
import { Icon } from '@iconify/react'
import { Button } from '@workduck-io/mex-components'
import { useAuthStore } from '../../Stores/useAuth'
import { apiURLs } from '@mexit/core'

interface ShortenURLProps {
  link?: Link
}

// TODO: Add a input to enter shorten url
const ShortenURL = ({ link }: ShortenURLProps) => {
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const isShortend = link?.shortend !== undefined

  const onShortenClick = () => {
    if (isShortend) {
      const url = apiURLs.links.shortendLink(link?.shortend, getWorkspaceId())
      navigator.clipboard.writeText(url || '')
    } else {
      console.log('Shorten here')
    }
  }

  return (
    <Button onClick={onShortenClick}>
      <Icon icon={linkM} />
      {isShortend ? link?.shortend : 'Shorten URL'}
    </Button>
  )
}

export default ShortenURL
