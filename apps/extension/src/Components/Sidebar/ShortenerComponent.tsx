import React, { MetaHTMLAttributes, useMemo } from 'react'

import styled from 'styled-components'

import { getFavicon, Link, Tag } from '@mexit/core'
import {
  AddTagMenu,
  CopyButton,
  GenericFlex,
  LinkShortenAndTagsWrapper,
  LinkTitleWrapper,
  LinkWrapper,
  ShortenURL,
  TagsLabel
} from '@mexit/shared'

import { useAuthStore } from '../../Hooks/useAuth'
import { useLinkURLs } from '../../Hooks/useURLs'
import { useLinkStore } from '../../Stores/useLinkStore'
import { getElementById } from '../../Utils/cs-utils'

const ShortenerWrapper = styled(LinkWrapper)`
  padding: 0;
`

const UrlTitleWrapper = styled(LinkTitleWrapper)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  color: ${({ theme }) => theme.tokens.text.fade};
  font-size: 1em;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0.25rem 0;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  img {
    margin: 0.25rem 0.5rem;
  }
`

const FaviconImage = ({ source }: { source: string }) => {
  // mog('rendering favicon', { source })
  return <img height="20px" width="20px" src={getFavicon(source)} />
}

const getGoodMeta = (document: Document) => {
  return {
    title: document.title,
    description: (document.querySelector('meta[name="description"]') as MetaHTMLAttributes<HTMLElement>)?.content,
    imgSrc: (document.querySelector('meta[property="og:image"]') as MetaHTMLAttributes<HTMLElement>)?.content
  }
}

export const ShortenerComponent = () => {
  const { links } = useLinkStore()
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { updateAlias, saveLink, isDuplicateAlias, getTags, addTag, removeTag } = useLinkURLs()
  // const { saveLink: saveLinkAPI } = useURLsAPI()

  const link = useMemo(() => {
    const l = links.find((l) => l.url === window.location.href)
    return (
      l ?? {
        url: window.location.href,
        ...getGoodMeta(document)
      }
    )
  }, [links, window.location])

  const tags = useMemo(() => {
    if (!link) return []

    return link.tags?.map((t) => ({ value: t })) ?? []
  }, [link])

  const toAddTags = getTags(link?.tags)

  const onUpdateAlias = (linkurl: string, alias: string) => {
    if (links.find((l) => l.url === linkurl)) {
      updateAlias(linkurl, alias)
    } else {
      const newLink = { ...link, url: linkurl, alias: alias }
      saveLink(newLink)
    }
  }

  const onAddNewTag = (tag: Tag) => {
    // If link doesn't exist yet just save it with the tag provided
    if (links.find((l) => l.url === link.url)) {
      addTag(link.url, tag.value)
    } else {
      const newLink: Link = { ...link, tags: [tag.value] }
      saveLink(newLink)
    }
  }

  const onAddCreateTag = (tagStr: string) => {
    // If link doesn't exist yet just save it with the tag provided
    if (links.find((l) => l.url === link.url)) {
      addTag(link.url, tagStr)
    } else {
      const newLink: Link = { ...link, tags: [tagStr] }
      saveLink(newLink)
    }
  }

  const onRemoveTag = (tagStr: string) => {
    removeTag(link.url, tagStr)
  }

  return (
    <ShortenerWrapper>
      <UrlTitleWrapper>
        <GenericFlex>
          <FaviconImage source={window.location.href} />
          {window.location.hostname}
        </GenericFlex>

        <CopyButton text={window.location.href} />
      </UrlTitleWrapper>
      <LinkShortenAndTagsWrapper>
        <ShortenURL
          link={link}
          workspaceId={getWorkspaceId()}
          updateAlias={onUpdateAlias}
          isDuplicateAlias={isDuplicateAlias}
        />
        <AddTagMenu
          root={getElementById('ext-side-nav')}
          createTag={onAddCreateTag}
          tags={toAddTags}
          addTag={onAddNewTag}
        />
      </LinkShortenAndTagsWrapper>
      <TagsLabel
        tags={tags}
        onClick={() => console.log('clicked on tags')}
        onDelete={(val: string) => onRemoveTag(val)}
      />
    </ShortenerWrapper>
  )
}
