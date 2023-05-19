import React, { MetaHTMLAttributes, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

import linkM from '@iconify/icons-ri/link-m'
import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { apiURLs, deleteQueryParams, getFavicon, useAuthStore, useLinkStore } from '@mexit/core'
import {
  CopyButton,
  DefaultMIcons,
  DisplayShortcut,
  GenericFlex,
  Input,
  LinkTitleWrapper,
  MexIcon,
  ShortenButton,
  ShortenerTitle
} from '@mexit/shared'

import { useLinkURLs } from '../../Hooks/useURLs'

const ShortenerWrapper = styled(ShortenButton)`
  padding: ${({ theme }) => theme.spacing.small};
  font-size: 14px !important;
`

const UrlTitleWrapper = styled(LinkTitleWrapper)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: 1em;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  /* padding: 0.25rem 0; */
  padding: ${({ theme }) => theme.spacing.small};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const FaviconImage = ({ source }: { source: string }) => {
  return <img height="20px" width="20px" src={getFavicon(source)} />
}

const getGoodMeta = (document: Document) => {
  return {
    title: document.title,
    description: (document.querySelector('meta[name="description"]') as MetaHTMLAttributes<HTMLElement>)?.content,
    imgSrc: (document.querySelector('meta[property="og:image"]') as MetaHTMLAttributes<HTMLElement>)?.content
  }
}

const Text = styled.div`
  line-height: 2.1;
`

const StyledInput = styled(Input)`
  &:focus-visible,
  :hover,
  :focus {
    border: none;
  }
  background: none;
  width: 100%;
  border: none;
`

const FadedShortcut = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.tokens.text.fade};
  opacity: 0.9;
`

const validLink = /^[a-z0-9_-]+$/i

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

const StyledShortener = styled.div`
  display: flex;
  color: ${({ theme }) => theme.tokens.text.default};
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

export const URLShortner = ({ alias, url, editable, isDuplicateAlias, updateAlias, setEditable }) => {
  const [short, setShort] = useState<string>(alias)
  const workspaceId = useAuthStore((s) => s.getWorkspaceId)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setShort(e.target.value)
  }

  const reset = () => {
    setEditable(false)
    setShort(alias)
  }

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()

      if (short && !validLink.test(short)) {
        toast.error('Invalid alias! Only alphanumeric characters are allowed.')
        return
      }
      if (!isDuplicateAlias(short)) {
        updateAlias(url, short)
      } else {
        toast.error('Alias already exists')
      }

      reset()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      reset()
    }
  }

  const text = useMemo(
    () => (alias ? apiURLs.links.shortendLink(alias, workspaceId()) : deleteQueryParams(window.location.href)),
    [alias]
  )

  return !editable ? (
    alias ? (
      <StyledShortener>
        <InputContainer>
          <Icon width={20} height={20} icon={linkM} />
          <Text>{alias}</Text>
        </InputContainer>
        <InputContainer>
          <MexIcon width={20} height={20} icon={DefaultMIcons.EDIT.value} onClick={() => setEditable(true)} />
          <CopyButton size="20" text={text} isIcon />
        </InputContainer>
      </StyledShortener>
    ) : (
      <InputContainer>
        <ShortenerWrapper isShortend={!!alias} transparent onClick={() => setEditable(true)}>
          <Icon width={20} height={20} icon={linkM} />
          Shorten
        </ShortenerWrapper>
        <CopyButton size="20" text={text} isIcon />
      </InputContainer>
    )
  ) : (
    <StyledShortener>
      <InputContainer>
        <Icon width={20} height={20} icon={linkM} />
        <StyledInput
          id={`shorten-url`}
          name="ShortenUrlInput"
          onKeyDown={handleSubmit}
          onChange={(e) => handleChange(e)}
          autoFocus
          placeholder="Enter shorten URL"
          defaultValue={short}
        />
      </InputContainer>

      <GenericFlex>
        <GenericFlex>
          <DisplayShortcut shortcut="Enter" />
          <FadedShortcut>&nbsp;to save</FadedShortcut>
        </GenericFlex>
        <MexIcon width={20} height={20} icon={DefaultMIcons.CLEAR.value} onClick={reset} />
      </GenericFlex>
    </StyledShortener>
  )
}

export const ShortenerComponent = () => {
  const { links } = useLinkStore()
  const [editable, setEditable] = useState(false)
  const { updateAlias, saveLink, isDuplicateAlias } = useLinkURLs()

  const link = useMemo(() => {
    const url = deleteQueryParams(window.location.href)
    const l = links.find((l) => l.url === url)
    return (
      l ?? {
        url: url,
        ...getGoodMeta(document)
      }
    )
  }, [links, window.location])

  const onUpdateAlias = (linkurl: string, alias: string) => {
    if (links.find((l) => l.url === linkurl)) {
      updateAlias(linkurl, alias)
    } else {
      const newLink = { ...link, url: linkurl, alias: alias }
      saveLink(newLink)
    }
  }

  const url = deleteQueryParams(window.location.href)

  return (
    <UrlTitleWrapper>
      {!editable && !link?.alias && (
        <InputContainer>
          <FaviconImage source={url} />
          <ShortenerTitle>{window.location.hostname}</ShortenerTitle>
        </InputContainer>
      )}

      <URLShortner
        editable={editable}
        setEditable={setEditable}
        updateAlias={onUpdateAlias}
        url={link?.url}
        alias={link?.alias}
        isDuplicateAlias={isDuplicateAlias}
      />
    </UrlTitleWrapper>
  )
}
