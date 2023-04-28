import React from 'react'

import { getNameFromPath, MenuListItemType, MIcon, SHARED_NAMESPACE, useDataStore, useMetadataStore } from '@mexit/core'

import { StyledButton } from '../Style/Buttons'

import { Menu, MenuItem } from './FloatingElements'
import { IconDisplay } from './IconDisplay'
import { DefaultMIcons } from './Icons'

interface InsertMenuProps {
  onClick?: any
  items?: Array<Partial<MenuListItemType>>
  title?: string
  icon?: MIcon
  root?: any
  isMenu?: boolean
}

export const InsertMenu: React.FC<InsertMenuProps> = ({ onClick, title = 'Insert', items, isMenu, root, icon }) => {
  if (!isMenu) {
    return (
      <StyledButton onClick={onClick}>
        <IconDisplay icon={icon ?? DefaultMIcons.EMBED} size={12} />
        {title}
      </StyledButton>
    )
  }

  const getQuickLinks = () => {
    const ilinks = useDataStore.getState().ilinks
    const sharedNodes = useDataStore.getState().sharedNodes
    const namespaces = useDataStore.getState().spaces
    const metadata = useMetadataStore.getState().metadata.notes

    const mLinks = ilinks.map((l) => ({
      label: getNameFromPath(l.path),
      icon: metadata[l.nodeid]?.icon ?? DefaultMIcons.NOTE,
      id: l.nodeid,
      category: namespaces.find((n) => n.id === l.namespace)?.name
    }))

    const sLinks = sharedNodes.map((l) => ({
      label: getNameFromPath(l.path),
      icon: metadata[l.nodeid]?.icon ?? DefaultMIcons.SHARED_NOTE,
      id: l.nodeid,
      category: SHARED_NAMESPACE.name
    }))

    return [...mLinks, ...sLinks]
  }

  const noteLinks = items ?? getQuickLinks()

  return (
    <Menu
      allowSearch
      noBackground
      noPadding
      searchPlaceholder="Search for a Note..."
      root={root}
      values={
        <StyledButton>
          <IconDisplay icon={icon ?? DefaultMIcons.EMBED} size={12} />
          {title}
        </StyledButton>
      }
    >
      {noteLinks.map((item) => {
        return (
          <MenuItem
            label={item.label}
            fontSize="small"
            icon={item.icon}
            key={item.id}
            onClick={() => onClick(item.id)}
          />
        )
      })}
    </Menu>
  )
}
