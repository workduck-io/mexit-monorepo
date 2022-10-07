import React from 'react'

import { Tag } from '@mexit/core'
import { TagFlex, TagsFlex } from '@mexit/shared'

import { NavigationType, useRouting, ROUTE_PATHS } from '../../Hooks/useRouting'

const TagLabel = ({ tag, onClick }: { tag: Tag; onClick?: (tag: string) => void }) => {
  const { goTo } = useRouting()
  // const isSpotlight = useSpotlightContext()

  const onClickTag = (tag: string) => {
    // if (isSpotlight) return
    if (onClick) {
      onClick(tag)
    } else goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  return (
    <TagFlex
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClickTag(tag.value)
      }}
    >
      #{tag.value}
    </TagFlex>
  )
}

export const TagsLabel = ({ tags, onClick }: { tags: Tag[]; onClick?: (tag: string) => void }) => {
  return (
    <TagsFlex>
      {tags.map((tag) => (
        <TagLabel key={`Tags_Label_${tag.value}`} onClick={onClick} tag={tag} />
      ))}
    </TagsFlex>
  )
}

export default TagLabel
