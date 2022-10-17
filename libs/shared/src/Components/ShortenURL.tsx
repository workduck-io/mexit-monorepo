import React, { useState } from 'react'

import edit2Line from '@iconify/icons-ri/edit-2-line'
import linkM from '@iconify/icons-ri/link-m'
import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'

import { apiURLs, mog, Link } from '@mexit/core'

import { Input } from '../Style/Form'
import { ShortenSectionWrapper, ShortenButton } from '../Style/ShortenURL.style'
import { Tooltip } from './FloatingElements'

interface ShortenURLProps {
  link?: Link
  workspaceId?: string
  updateAlias?: (linkurl: string, alias: string) => void
  isDuplicateAlias?: (alias: string) => boolean
}

const validLink = /^[a-z0-9]+$/i

// TODO: Add a input to enter shorten url
export const ShortenURL = ({ link, workspaceId, updateAlias, isDuplicateAlias }: ShortenURLProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const isShortend = link?.alias !== undefined
  const [editable, setEditable] = useState(false)
  const [short, setShort] = useState(link?.alias)

  const handleShortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setShort(e.target.value)
  }

  const onShortenClick = () => {
    if (isShortend) {
      const url = apiURLs.links.shortendLink(link?.alias, workspaceId)
      navigator.clipboard.writeText(url || '')

      // If successful, update the isCopied state value
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } else {
      setEditable(true)
    }
  }

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      const valid = validLink.test(short)
      mog('handleSubmit', { valid, short })
      if (short && !validLink.test(short)) {
        toast.error('Invalid alias! Only alphanumeric characters are allowed.')
        return
      }
      if (!isDuplicateAlias(short)) {
        updateAlias(link?.url, short)
      } else {
        toast.error('Alias already exists')
      }
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
          <Icon className="showOnHoverIcon" onClick={() => setEditable(true)} icon={edit2Line} />
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
