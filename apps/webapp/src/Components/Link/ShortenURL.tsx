import React from 'react'
import linkM from '@iconify/icons-ri/link-m'
import { Link } from '../../Stores/useLinkStore'
import { Icon } from '@iconify/react'
import { Button } from '@workduck-io/mex-components'

interface ShortenURLProps {
  link?: Link
}

// TODO: Add a input to enter shorten url
const ShortenURL = ({ link }: ShortenURLProps) => {
  const isShortend = link?.shortend !== undefined

  const onShortenClick = () => {
    if (isShortend) {
      navigator.clipboard.writeText(link?.shortend || '')
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
