import React, { useEffect, useMemo, useState } from 'react'

import styled from 'styled-components'

import { getFavicon, Link, Tag } from '@mexit/core'
import {
  AddTagMenu,
  LinkShortenAndHighlightSection,
  LinkShortenAndTagsWrapper,
  LinkTagSection,
  LinkTitleWrapper,
  LinkWrapper,
  ShortenURL,
  TagsLabel
} from '@mexit/shared'

import { useAuthStore } from '../../Hooks/useAuth'
import { useLinkURLs } from '../../Hooks/useURLs'
import { useLinkStore } from '../../Stores/useLinkStore'
import { getElementById } from '../../contentScript'

const ShortenerWrapper = styled(LinkWrapper)`
  padding: 0;
`

const UrlTitleWrapper = styled(LinkTitleWrapper)`
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 1rem;
  width: 100%;

  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.25rem 0;

  img {
    margin: 0.25rem 0.5rem;
  }
`

const FaviconImage = ({ source }: { source: string }) => {
  // mog('rendering favicon', { source })
  return <img height="20px" width="20px" src={getFavicon(source)} alt="favicon" />
}

export const ShortenerComponent = () => {
  const { links } = useLinkStore()
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { updateAlias, isDuplicateAlias, getTags, addTag, removeTag } = useLinkURLs()

  const link = useMemo(() => {
    return links.find((l) => l.url === window.location.href)
  }, [links, window.location])

  const tags = useMemo(() => {
    if (!link) return []

    return link.tags?.map((t) => ({ value: t })) ?? []
  }, [link])

  const toAddTags = getTags(link?.tags)

  const onAddNewTag = (tag: Tag) => {
    // mog('onAddNewTag', { tag })
    addTag(link.url, tag.value)
  }

  const onAddCreateTag = (tagStr: string) => {
    addTag(link.url, tagStr)
  }

  const onRemoveTag = (tagStr: string) => {
    removeTag(link.url, tagStr)
  }

  return (
    <ShortenerWrapper>
      <UrlTitleWrapper>
        <FaviconImage source={window.location.href} />
        {window.location.href}
      </UrlTitleWrapper>
      <LinkShortenAndTagsWrapper>
        <ShortenURL
          link={link}
          workspaceId={getWorkspaceId()}
          updateAlias={updateAlias}
          isDuplicateAlias={isDuplicateAlias}
        />
        <LinkTagSection>
          <TagsLabel
            tags={tags}
            onClick={() => console.log('clicked on tags')}
            onDelete={(val: string) => console.log('link delete', val)}
          />
          <AddTagMenu
            root={getElementById('ext-side-nav')}
            createTag={onAddCreateTag}
            tags={toAddTags}
            addTag={onAddNewTag}
          />
        </LinkTagSection>
      </LinkShortenAndTagsWrapper>
    </ShortenerWrapper>
  )
}
