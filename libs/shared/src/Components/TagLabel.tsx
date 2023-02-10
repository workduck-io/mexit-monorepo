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
        {onDelete && (
          <Icon
            icon="ri:close-line"
            height={12}
            width={12}
            className="showOnHoverIcon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(tag.value)
            }}
          />
        )}
      </TagFlexText>
    </TagFlex>
  )
}

interface TagsLabelProps {
  tags: Tag[]
  onClick?: (tag: string) => void
  onDelete?: (tag: string) => void
  flex?: boolean
}

export const TagsLabel = ({ tags, onClick, onDelete, flex = true }: TagsLabelProps) => {
  if (!flex)
    return (
      <>
        {tags.slice(0, 8).map((tag) => (
          <TagLabel key={`Tags_Label_${tag.value}`} onClick={onClick} onDelete={onDelete} tag={tag} />
        ))}
      </>
    )

  return (
    <TagsFlex>
      {tags.slice(0, 8).map((tag) => (
        <TagLabel key={`Tags_Label_${tag.value}`} onClick={onClick} onDelete={onDelete} tag={tag} />
      ))}
    </TagsFlex>
  )
}

export default TagLabel
