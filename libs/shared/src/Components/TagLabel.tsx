import React from 'react'

import { Icon } from '@iconify/react'

import { Tag } from '@mexit/core'

import { TagFlex, TagFlexText, TagsFlex } from '../Style/TagsRelated.styles'

interface TagLabelProps {
  tag: Tag
  onClick?: (tag: string) => void
  onDelete?: (tag: string) => void
}

const TagLabel = ({ tag, onClick, onDelete }: TagLabelProps) => {
  // const isSpotlight = useSpotlightContext()

  const onClickTag = (tag: string) => {
    // if (isSpotlight) return
    if (onClick) {
      onClick(tag)
    }
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
