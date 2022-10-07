import React, { useState } from 'react'
import linkM from '@iconify/icons-ri/link-m'
import { Link } from '../../Stores/useLinkStore'
import { Icon } from '@iconify/react'
import { Button } from '@workduck-io/mex-components'
import edit2Line from '@iconify/icons-ri/edit-2-line'
import { useAuthStore } from '../../Stores/useAuth'
import { apiURLs } from '@mexit/core'
import { Input } from '@mexit/shared'
import { ShortenButton, ShortenSectionWrapper } from './ShortenURL.style'
import { Tooltip } from '../FloatingElements/Tooltip'

interface ShortenURLProps {
  link?: Link
}

// TODO: Add a input to enter shorten url
const ShortenURL = ({ link }: ShortenURLProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const isShortend = link?.alias !== undefined
  const [editable, setEditable] = useState(false)
  const [short, setShort] = useState(link?.alias)

  const handleShortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setShort(e.target.value)
  }

  const onShortenClick = () => {
    if (isShortend) {
      const url = apiURLs.links.shortendLink(link?.alias, getWorkspaceId())
      navigator.clipboard.writeText(url || '')

      // If successful, update the isCopied state value
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } else {
      console.log('Shorten enabled')
      setEditable(true)
    }
  }

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      console.log('Shorten here', { short })
      setEditable(false)
      reset()
      // }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      reset()
    }
  }

  const reset = () => {
    setEditable(false)
    setShort(link?.alias)
  }

  return !editable ? (
    <ShortenSectionWrapper>
      <Tooltip content={isShortend ? (isCopied ? 'Copied to clipboard!' : 'Click to copy') : 'Shorten URL'}>
        <ShortenButton isShortend={isShortend} transparent onClick={onShortenClick}>
          <Icon icon={linkM} />
          {isShortend ? link?.alias : 'Shorten URL'}
        </ShortenButton>
      </Tooltip>
      {isShortend && (
        <Tooltip content={'Edit Shortened URL'}>
          <Icon className="showOnHover" onClick={() => setEditable(true)} icon={edit2Line} />
        </Tooltip>
      )}
    </ShortenSectionWrapper>
  ) : (
    <Input
      id={`shorten-${link?.url}`}
      name="ShortenUrlInput"
      onKeyDown={handleSubmit}
      onChange={(e) => handleShortChange(e)}
      onBlur={() => reset()}
      // TODO: Check if the short is already taken
      // error={}
      autoFocus
      defaultValue={short}
    />
  )
}

export default ShortenURL
