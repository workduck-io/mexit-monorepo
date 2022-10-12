import React, { useMemo } from 'react'

import { IconButton } from '@workduck-io/mex-components'

import { mog, Tag } from '@mexit/core'
import { RelativeTime } from '@mexit/shared'

import { useLinkURLs } from '../../Hooks/useURLs'
import { Link } from '../../Stores/useLinkStore'
import { Tooltip } from '../FloatingElements/Tooltip'
import { TagsLabel } from '../Sidebar/TagLabel'
import AddTagMenu from './AddTagMenu'
import HighlightGroups, { HighlightGroupToggle } from './HighlightGroup'
import {
  LinkHeader,
  LinkMetadataAndDelete,
  LinkShortenAndHighlightSection,
  LinkShortenAndTagsWrapper,
  LinkTagSection,
  LinkTitleWrapper,
  LinkWrapper
} from './Link.style'
import ShortenURL from './ShortenURL'

// * Get Favicon url
const getFavicon = (source: string) => {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${source}&SIZE=64`
}

interface LinkProps {
  link: Link
  addTagFilter: (tag: string) => void
}

const FaviconImage = ({ source }: { source: string }) => {
  // mog('Rendering favicon', { source })
  return <img height="20px" width="20px" src={getFavicon(source)} alt="favicon" />
}

const LinkComponent = ({ link, addTagFilter }: LinkProps) => {
  const tags = link.tags?.map((t) => ({ value: t })) ?? []
  const { getTags, addTag, removeTag, deleteLink, getHighlights } = useLinkURLs()

  const [highlightsOpen, setHighlightsOpen] = React.useState(false)

  const toAddTags = getTags(link.tags)

  const highlights = getHighlights(link)

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

  const onRemoveTag = (tagStr: string) => {
    removeTag(link.url, tagStr)
  }

  const onDeleteLink = (url: string) => {
    deleteLink(url)
  }

  // mog('LinkComponent', { link, highlights })

  return (
    <LinkWrapper>
      <LinkHeader>
        <Tooltip content={link.url}>
          <LinkTitleWrapper onClick={() => onOpenLink(link.url)}>
            <FaviconImage source={link.url} />
            {link.title}
          </LinkTitleWrapper>
        </Tooltip>
        <LinkMetadataAndDelete>
          {link.createdAt && <RelativeTime prefix="Saved on" dateNum={link.createdAt} />}
          <IconButton title="Delete" icon="ri:delete-bin-5-line" onClick={() => onDeleteLink(link.url)} />
        </LinkMetadataAndDelete>
      </LinkHeader>
      <LinkShortenAndTagsWrapper>
        <LinkShortenAndHighlightSection>
          <ShortenURL link={link} />
          <HighlightGroupToggle open={highlightsOpen} setOpen={setHighlightsOpen} highlights={highlights} link={link} />
        </LinkShortenAndHighlightSection>
        <LinkTagSection>
          <TagsLabel tags={tags} onClick={addTagFilter} onDelete={(val: string) => onRemoveTag(val)} />
          <AddTagMenu createTag={onAddCreateTag} tags={toAddTags} addTag={onAddNewTag} />
        </LinkTagSection>
      </LinkShortenAndTagsWrapper>
      <HighlightGroups open={highlightsOpen} setOpen={setHighlightsOpen} highlights={highlights} link={link} />
    </LinkWrapper>
  )
}

export default LinkComponent
