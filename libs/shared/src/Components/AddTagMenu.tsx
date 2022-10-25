import React from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'
import { getLeafNode } from '@udecode/plate'

import { mog, Tag } from '@mexit/core'

import { FilterMenuDiv } from '../Style/Filter.style'
import { Menu, MenuItem } from './FloatingElements/Dropdown'

interface AddTagMenuProps {
  tags: Tag[]
  addTag: (tag: Tag) => void
  createTag: (tag: string) => void
  root?: HTMLElement | null
}

export const AddTagClassName = 'new-tag-menu'

export const AddTagMenu = ({ tags, addTag, createTag, root }: AddTagMenuProps) => {
  // mog('AddTagMenu', { tags })
  const onAddNewTag = (tag: Tag) => {
    addTag(tag)
  }

  const onCreateNewTag = (tagStr: string) => {
    // mog('onCreateNewTag', { tagStr })
    createTag(tagStr)
  }

  return (
    <Menu
      className={AddTagClassName}
      values={
        <FilterMenuDiv>
          <Icon icon={addCircleLine} />
          Add Tag
        </FilterMenuDiv>
      }
      allowSearch
      onCreate={onCreateNewTag}
      searchPlaceholder={`Search for a tag`}
      root={root}
    >
      {tags.map((t) => (
        <MenuItem
          key={`NewTagMenu-${t.value}`}
          icon={{ type: 'ICON', value: 'ri:hashtag' }}
          onClick={() => {
            onAddNewTag(t)
          }}
          label={t.value}
        />
      ))}
    </Menu>
  )
}