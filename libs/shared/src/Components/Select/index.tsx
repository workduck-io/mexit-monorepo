import React, { useState } from 'react'

import { MenuListItemType, MIcon } from '@mexit/core'

import { Group } from '../../Style/Layouts'
import { ItemLabel, Menu, MenuItem } from '../FloatingElements'
import { IconDisplay } from '../IconDisplay'
import { getMIcon } from '../Icons'

interface SelectProps {
  items: MenuListItemType[]
  defaultValue?: MenuListItemType
  onClick?: (option: MenuListItemType) => void
  label?: string
  root?: any
}

export const Select: React.FC<SelectProps> = ({ items, onClick, defaultValue, label = 'Select', root }) => {
  const [selected, setSelected] = useState(defaultValue)

  const handleOnClick = (option: MenuListItemType) => {
    setSelected(option)
    if (onClick) onClick(option)
    else if (option?.onSelect) option.onSelect(option)
  }

  return (
    <Menu
      noHover
      noBackground
      values={
        <Group>
          <ItemLabel fontSize="small">{selected?.label ?? items?.at(0)?.label ?? label}</ItemLabel>
          <IconDisplay icon={getMIcon('ICON', 'bi:caret-down-fill')} size={10} />
        </Group>
      }
    >
      {items.map((op) => {
        return (
          <MenuItem
            fontSize="small"
            key={op.id}
            icon={op.icon as MIcon}
            onClick={(e) => handleOnClick(op)}
            label={op.label}
          />
        )
      })}
    </Menu>
  )
}
