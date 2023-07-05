import React from 'react'

import { getNameFromPath, MenuListItemType, MIcon, SHARED_NAMESPACE, useDataStore, useMetadataStore } from '@mexit/core'

import { StyledButton } from '../Style/Buttons'
import { Group } from '../Style/Layouts'
import { TooltipTitleWithShortcut } from '../Style/Tooltip'

import { Menu, MenuItem, Tooltip } from './FloatingElements'
import { IconDisplay } from './IconDisplay'
import { DefaultMIcons } from './Icons'

interface InsertMenuProps {
  onClick?: any
  items?: Array<Partial<MenuListItemType>>
  title?: string
  icon?: MIcon
  root?: any
  allowSearch?: boolean
  isMenu?: boolean
  type?: 'default' | 'modal'
  initialFocus?: boolean
  selected?: string
  name?: string
  placeholder?: string
  shortcut?: string
}

export const InsertMenu: React.FC<InsertMenuProps> = ({
  onClick,
  title = 'Insert',
  items,
  allowSearch = true,
  selected,
  isMenu,
  root,
  initialFocus,
  icon,
  name,
  type,
  placeholder,
  shortcut
}) => {
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

  const noteLinks = items ? items : getQuickLinks()
  return (
    <Menu
      allowSearch={allowSearch}
      noBackground
      type={type}
      noPadding
      searchPlaceholder={placeholder ?? 'Search for a Note...'}
      root={root}
      values={<AnchorNode selected={selected} items={noteLinks} icon={icon} title={title} shortcut={shortcut} />}
    >
      {noteLinks.map((item) => {
        return (
          <MenuItem
            label={item.label}
            fontSize="small"
            icon={item.icon}
            key={item.id}
            name={name ?? item.label}
            onClick={(e: any) => {
              onClick(item.id)
            }}
          />
        )
      })}
    </Menu>
  )
}

const AnchorNode = ({ selected, items, icon, title, shortcut }) => {
  const selectedItem = selected && items.find((i) => i.id === selected)

  const itemIcon = selectedItem?.icon ?? icon ?? DefaultMIcons.EMBED
  const label = selectedItem?.label ?? title

  return (
    <Tooltip content={shortcut ? <TooltipTitleWithShortcut title={title} shortcut={shortcut} /> : title} delay={100}>
      <StyledButton>
        <Group>
          <IconDisplay icon={itemIcon} size={14} />
          <span id="label">{label}</span>
        </Group>
      </StyledButton>
    </Tooltip>
  )
}
