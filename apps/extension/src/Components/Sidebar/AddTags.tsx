import React, { MetaHTMLAttributes, useMemo, useState } from 'react'

import { Link, Tag } from '@mexit/core'
import { AddTagMenu, LinkShortenAndTagsWrapper, TagsLabel } from '@mexit/shared'

import { useLinkURLs } from '../../Hooks/useURLs'
import { useLinkStore } from '../../Stores/useLinkStore'

const getGoodMeta = (document: Document) => {
  return {
    title: document.title,
    description: (document.querySelector('meta[name="description"]') as MetaHTMLAttributes<HTMLElement>)?.content,
    imgSrc: (document.querySelector('meta[property="og:image"]') as MetaHTMLAttributes<HTMLElement>)?.content
  }
}

export const AddTags = () => {
  const { links } = useLinkStore()
  const { saveLink, getTags, addTag, removeTag } = useLinkURLs()
  const [root, setRoot] = useState<any>()

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
    <LinkShortenAndTagsWrapper
      ref={(node) => {
        if (node) setRoot(node)
      }}
    >
      <TagsLabel flex={false} tags={tags} onDelete={(val: string) => onRemoveTag(val)} />
      <AddTagMenu root={root} createTag={onAddCreateTag} tags={toAddTags} addTag={onAddNewTag} />
    </LinkShortenAndTagsWrapper>
  )
}
