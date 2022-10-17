import React, { useEffect, useState } from 'react'

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
  const [link, setLink] = useState<Link>()
  const [tags, setTags] = useState<Tag[]>([])

  const { links } = useLinkStore()
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { updateAlias, isDuplicateAlias, getTags } = useLinkURLs()

  const toAddTags = getTags(link?.tags)

  useEffect(() => {
    const link = links.find((link) => link.url === window.location.href)

    if (link) {
      setTags(link.tags?.map((t) => ({ value: t })))
      setLink(link)
    }
  }, [])

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
            createTag={() => console.log('Trying to create a new tag')}
            tags={toAddTags}
            addTag={() => console.log('add a new tag')}
          />
        </LinkTagSection>
      </LinkShortenAndTagsWrapper>
    </ShortenerWrapper>
  )
}
