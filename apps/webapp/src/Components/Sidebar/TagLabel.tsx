import React from 'react'

import { Tag } from '@mexit/core'
import { TagFlex, TagsFlex } from '@mexit/shared'

import { NavigationType, useRouting, ROUTE_PATHS } from '../../Hooks/useRouting'

const TagLabel = ({ tag }: { tag: Tag }) => {
  const { goTo } = useRouting()
  // const isSpotlight = useSpotlightContext()

  const navigateToTag = (tag: string) => {
    // if (isSpotlight) return
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  return (
    <TagFlex
      onClick={(e) => {
        e.preventDefault()
        navigateToTag(tag.value)
      }}
    >
      #{tag.value}
    </TagFlex>
  )
}

export const TagsLabel = ({ tags }: { tags: Tag[] }) => {
  return (
    <TagsFlex>
      {tags.map((tag) => (
        <TagLabel key={`Tags_Label_${tag.value}`} tag={tag} />
      ))}
    </TagsFlex>
  )
}

export default TagLabel
