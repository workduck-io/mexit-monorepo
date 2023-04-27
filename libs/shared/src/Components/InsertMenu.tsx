import React from 'react'

import { getNameFromPath, MenuListItemType, SHARED_NAMESPACE, useDataStore, useMetadataStore } from '@mexit/core'

import { StyledButton } from '../Style/Buttons'

import { Menu, MenuItem } from './FloatingElements'
import { IconDisplay } from './IconDisplay'
import { DefaultMIcons } from './Icons'

interface InsertMenuProps {
  onClick?: any
  items?: Array<MenuListItemType>
  title?: string
  root?: any
  isMenu?: boolean
}

const InsertMenu: React.FC<InsertMenuProps> = ({ onClick, title = 'Insert', isMenu, root }) => {
  if (!isMenu) {
    return (
      <StyledButton onClick={onClick}>
        <IconDisplay icon={DefaultMIcons.EMBED} size={12} />
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
      icon: metadata[l.nodeid]?.icon,
      id: l.nodeid,
      category: namespaces.find((n) => n.id === l.namespace)?.name
    }))

    const sLinks = sharedNodes.map((l) => ({
      label: getNameFromPath(l.path),
      icon: metadata[l.nodeid]?.icon,
      id: l.nodeid,
      category: SHARED_NAMESPACE.name
    }))

    return [...mLinks, ...sLinks]
  }

  const noteLinks = getQuickLinks()

  return (
    <Menu
      allowSearch
      noBackground
      enableAutoUpdate={false}
      noPadding
      searchPlaceholder="Search for a Note..."
      root={root}
      values={
        <StyledButton onClick={onClick}>
          <IconDisplay icon={DefaultMIcons.EMBED} size={12} />
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

export default InsertMenu
