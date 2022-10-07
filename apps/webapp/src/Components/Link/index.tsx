import { mog, Tag } from '@mexit/core'
import { ProjectIconMex } from '@mexit/shared'
import React from 'react'
import { useLinkURLs } from '../../Hooks/useURLs'
import { Link } from '../../Stores/useLinkStore'
import { TagsLabel } from '../Sidebar/TagLabel'
import AddTagMenu from './AddTagMenu'
import { LinkShortenAndTagsWrapper, LinkTitleWrapper, LinkWrapper } from './Link.style'

// * Get Favicon url
const getFavicon = (source: string) => {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${source}&size=64`
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
    mog('onAddNewTag', { tag })
    addTag(link.id, tag.value)
  }

  const onAddCreateTag = (tagStr: string) => {
    addTag(link.id, tagStr)
  }

  return (
    <LinkWrapper>
      <LinkTitleWrapper>
        <ProjectIconMex icon={favUrl} isMex={false} size={20} />
        {link.title}
      </LinkTitleWrapper>
      <LinkShortenAndTagsWrapper>
        <TagsLabel tags={tags} onClick={addTagFilter} />
        <AddTagMenu createTag={onAddCreateTag} tags={toAddTags} addTag={onAddNewTag} />
      </LinkShortenAndTagsWrapper>
    </LinkWrapper>
  )
}

export default LinkComponent
