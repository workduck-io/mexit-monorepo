import React from 'react'

import { Tag } from '@mexit/core'

import { FilterMenuDiv } from '../Style/Filter.style'

import { Menu, MenuItem } from './FloatingElements/Dropdown'
import { IconDisplay } from './IconDisplay'
import { DefaultMIcons } from './Icons'

interface AddTagMenuProps {
  tags: Tag[]
  addTag: (tag: Tag) => void
  createTag: (tag: string) => void
  root?: HTMLElement | null
}

export const AddTagClassName = 'new-tag-menu'

export const AddTagMenu = ({ tags, addTag, createTag, root }: AddTagMenuProps) => {
  const onAddNewTag = (tag: Tag) => {
    addTag(tag)
  }

  const onCreateNewTag = (tagStr: string) => {
    createTag(tagStr)
  }

  return (
    <Menu
      className={AddTagClassName}
      values={
        <FilterMenuDiv>
          <IconDisplay icon={DefaultMIcons.ADD} />
          Add
        </FilterMenuDiv>
      }
      noHover
      allowSearch
      onCreate={onCreateNewTag}
      searchPlaceholder={`Search for a tag`}
      root={root}
    >
      {tags.map((t) => (
        <MenuItem
          key={`NewTagMenu-${t.value}`}
          icon={{ type: 'ICON', value: 'ri:hashtag' }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()

            onAddNewTag(t)
          }}
          label={t.value}
        />
      ))}
    </Menu>
  )
}
