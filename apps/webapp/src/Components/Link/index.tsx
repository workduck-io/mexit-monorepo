import { mog, Tag } from '@mexit/core'
import { ProjectIconMex } from '@mexit/shared'
import React from 'react'
import { useLinkURLs } from '../../Hooks/useURLs'
import { Link } from '../../Stores/useLinkStore'
import { Tooltip } from '../FloatingElements/Tooltip'
import { TagsLabel } from '../Sidebar/TagLabel'
import AddTagMenu from './AddTagMenu'
import { LinkShortenAndTagsWrapper, LinkTagSection, LinkTitleWrapper, LinkWrapper } from './Link.style'
import ShortenURL from './ShortenURL'

// * Get Favicon url
const getFavicon = (source: string) => {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${source}&SIZE=64`
}

interface LinkProps {
  link: Link
  addTagFilter: (tag: string) => void
}

const LinkComponent = ({ link, addTagFilter }: LinkProps) => {
  const favUrl = getFavicon(link.url)
  const tags = link.tags.map((t) => ({ value: t }))
  const { getTags, addTag } = useLinkURLs()

  const toAddTags = getTags(link.tags)

  const onAddNewTag = (tag: Tag) => {
    // mog('onAddNewTag', { tag })
    addTag(link.url, tag.value)
  }

  const onOpenLink = (url: string) => {
    mog('Opening link', { url })
    if (url) {
      window.open(url, '_blank')
    }
  }

  const onAddCreateTag = (tagStr: string) => {
    addTag(link.url, tagStr)
  }

  return (
    <LinkWrapper>
      <Tooltip content={link.url}>
        <LinkTitleWrapper onClick={() => onOpenLink(link.url)}>
          <ProjectIconMex icon={favUrl} isMex={false} size={20} />
          {link.title}
        </LinkTitleWrapper>
      </Tooltip>
      <LinkShortenAndTagsWrapper>
        <ShortenURL link={link} />
        <LinkTagSection>
          <TagsLabel tags={tags} onClick={addTagFilter} />
          <AddTagMenu createTag={onAddCreateTag} tags={toAddTags} addTag={onAddNewTag} />
        </LinkTagSection>
      </LinkShortenAndTagsWrapper>
    </LinkWrapper>
  )
}

export default LinkComponent
