import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { Icon } from '@iconify/react'

import { mog, Tag } from '@mexit/core'

import { FilterMenuDiv } from '../Filters/Filter.style'
import { Menu, MenuItem } from '../FloatingElements/Dropdown'

interface AddTagMenuProps {
  tags: Tag[]
  addTag: (tag: Tag) => void
  createTag: (tag: string) => void
}

export const AddTagClassName = 'new-tag-menu'

const AddTagMenu = ({ tags, addTag, createTag }: AddTagMenuProps) => {
  mog('AddTagMenu', { tags })
  const onAddNewTag = (tag: Tag) => {
    addTag(tag)
  }

  const onCreateNewTag = (tagStr: string) => {
    mog('onCreateNewTag', { tagStr })
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

export default AddTagMenu
