import { useMemo } from 'react'

import checkboxBlankCircleFill from '@iconify/icons-ri/checkbox-blank-circle-fill'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import { Entity } from 'rc-tree/lib/interface'

import { ItemContent, ItemCount, ItemTitle } from '@workduck-io/mex-components'

import { LastOpenedState , userPreferenceStore as useUserPreferenceStore } from '@mexit/core'
import { IconDisplay, ItemTitleText, StyledTreeItem, UnreadIndicator } from '@mexit/shared'

import { useLastOpened } from '../../Hooks/useLastOpened'

import { SidebarListItem } from './SidebarList'
import { TooltipContent } from './Tree'

interface SidebarListItemProps<T> {
  tippyTarget: any
  item: SidebarListItem<T>
  index: number

  select: {
    selectedItemId?: string
    selectIndex?: number
    onSelect: (itemId: string) => void
  }

  onContextMenu?: (item: SidebarListItem<T>, event: any) => void

  // To render the context menu if the item is right-clicked
  contextMenu: {
    ItemContextMenu?: (props: { item: SidebarListItem<T> }) => JSX.Element
    setContextOpenViewId: (viewId: string) => void
    contextOpenViewId: string
  }
}

const SidebarListItemComponent = <T extends Entity>({
  tippyTarget,
  select,
  index,
  item,
  onContextMenu,
  contextMenu
}: SidebarListItemProps<T>) => {
  const { contextOpenViewId } = contextMenu
  const { selectedItemId, selectIndex, onSelect } = select

  const lastOpenedNote = useUserPreferenceStore((state) => state.lastOpenedNotes[item?.lastOpenedId])
  const { getLastOpened } = useLastOpened()

  const lastOpenedState = useMemo(() => {
    const loState = getLastOpened(item?.lastOpenedId, lastOpenedNote)
    return loState
  }, [lastOpenedNote, item?.lastOpenedId])

  const isUnread = useMemo(() => {
    return lastOpenedState === LastOpenedState.UNREAD
  }, [lastOpenedState])

  return (
    <Tippy
      theme="mex"
      placement="right"
      singleton={tippyTarget}
      key={`DisplayTippy_${item.id}`}
      content={<TooltipContent item={{ id: item.id, children: [], data: { title: item.label } }} />}
    >
      <span>
        <StyledTreeItem
          onContextMenu={(e) => {
            e.preventDefault()
            if (onContextMenu) onContextMenu(item, e)
          }}
          hasMenuOpen={contextOpenViewId === item.id || selectIndex === index}
          noSwitcher
          // isUnread={isUnread}
          selected={item?.id === selectedItemId}
          hasIconHover={!!item.hoverIcon}
        >
          <ItemContent onClick={() => onSelect(item?.id)}>
            <ItemTitle>
              {item.hoverIcon && (
                <Icon
                  className="iconOnHover"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    item.onIconClick && item.onIconClick(item.id)
                  }}
                  icon={item.hoverIcon}
                />
              )}
              <IconDisplay className="defaultIcon" icon={item.icon} />
              <ItemTitleText>{item.label}</ItemTitleText>
            </ItemTitle>
          </ItemContent>
          {isUnread && (
            <ItemCount>
              <UnreadIndicator>
                <Icon icon={checkboxBlankCircleFill} />
              </UnreadIndicator>
            </ItemCount>
          )}
        </StyledTreeItem>
      </span>
    </Tippy>
  )
}

export default SidebarListItemComponent
