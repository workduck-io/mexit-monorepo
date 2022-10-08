import React from 'react'

import { mog, Tag } from '@mexit/core'
import { TagFlex, TagsFlex, TagFlexText, IconButton } from '@mexit/shared'

import { NavigationType, useRouting, ROUTE_PATHS } from '../../Hooks/useRouting'
import { Icon } from '@iconify/react'

interface TagLabelProps {
  tag: Tag
  onClick?: (tag: string) => void
  onDelete?: (tag: string) => void
}

const TagLabel = ({ tag, onClick, onDelete }: TagLabelProps) => {
  const { goTo } = useRouting()
  // const isSpotlight = useSpotlightContext()

  const onClickTag = (tag: string) => {
    // if (isSpotlight) return
    if (onClick) {
      onClick(tag)
    } else goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  return (
    <TagFlex>
      <TagFlexText
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onClickTag(tag.value)
        }}
      >
        #{tag.value}
      </TagFlexText>
      {onDelete && (
        <Icon
          icon="ri:close-line"
          className="showOnHoverIcon"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(tag.value)
          }}
        />
      )}
    </TagFlex>
  )
}

interface TagsLabelProps {
  tags: Tag[]
  onClick?: (tag: string) => void
  onDelete?: (tag: string) => void
}

export const TagsLabel = ({ tags, onClick, onDelete }: TagsLabelProps) => {
  return (
    <TagsFlex>
      {tags.map((tag) => (
        <TagLabel key={`Tags_Label_${tag.value}`} onClick={onClick} onDelete={onDelete} tag={tag} />
      ))}
    </TagsFlex>
  )
}

export default TagLabel
