import React, { useEffect, useState } from 'react'

import { link } from 'fs'

import { getFavicon, Tag } from '@mexit/core'
import {
  LinkShortenAndHighlightSection,
  LinkShortenAndTagsWrapper,
  LinkTagSection,
  LinkTitleWrapper,
  LinkWrapper,
  ShortenURL,
  TagsLabel
} from '@mexit/shared'

import { useLinkStore } from '../../Stores/useLinkStore'

const FaviconImage = ({ source }: { source: string }) => {
  // mog('rendering favicon', { source })
  return <img height="20px" width="20px" src={getFavicon(source)} alt="favicon" />
}

export const ShortenerComponent = () => {
  const [tags, setTags] = useState<Tag[]>([])
  const { links } = useLinkStore()

  useEffect(() => {
    const link = links.find((link) => link.url === window.location.href)

    if (link) {
      setTags(link.tags?.map((t) => ({ value: t })))
    }
  }, [])

  return (
    <LinkWrapper>
      <LinkTitleWrapper>
        <FaviconImage source={window.location.href} />
        {window.location.href}
      </LinkTitleWrapper>
      <LinkShortenAndTagsWrapper>
        {/* <ShortenURL link={link} /> */}
        <LinkTagSection>
          <TagsLabel
            tags={tags}
            onClick={() => console.log('clicked on tags')}
            onDelete={(val: string) => console.log('link delete', val)}
          />
          {/* <AddTagMenu createTag={onAddCreateTag} tags={toAddTags} addTag={onAddNewTag} /> */}
        </LinkTagSection>
      </LinkShortenAndTagsWrapper>
    </LinkWrapper>
  )
}
