import { ChangeEventHandler, useEffect, useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon, IconifyIcon } from '@iconify/react'
import Tippy, { useSingleton } from '@tippyjs/react'
import { debounce } from 'lodash'

import { tinykeys } from '@workduck-io/tinykeys'

import { fuzzySearch, LastOpenedState, mog , useLayoutStore } from '@mexit/core'
import {
  DesignItem,
  EmptyMessage,
  FilteredItemsWrapper,
  IconDisplay,
  Input,
  isOnEditableElement,
  ItemTitle,
  SidebarListFilter,
  SidebarListWrapper,
  StyledTreeItem
} from '@mexit/shared'

import { ItemContent } from './SharedNotes'
import SidebarListItemComponent from './SidebarListItem'

export interface SidebarListItem<T> extends DesignItem {
  // Used to calculate the last opened state once in the list item component
  data: T
  lastOpenedId?: string
  // Used to pass the state computed to the context menu
  lastOpenedState?: LastOpenedState

  /**
   * Icon to show when the user hovers over the icon
   */
  hoverIcon?: string | IconifyIcon
  onIconClick?: (id: string) => void
}

export interface SidebarListProps<T> {
  items: SidebarListItem<T>[]
  // Action on item click
  onClick: (itemId: string) => void

  // If present selected item will be active
  selectedItemId?: string

  onContextMenu?: (item: SidebarListItem<T>, event: any) => void

  // If true, the list will be preceded by the default item
  defaultItems?: SidebarListItem<T>[]

  // To render the context menu if the item is right-clicked
  ItemContextMenu?: (props: { item: SidebarListItem<T> }) => JSX.Element

  // Searches by title of the items
  showSearch?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  noMargin?: boolean
}

const SidebarList = ({
  ItemContextMenu,
  selectedItemId,
  onClick,
  items,
  defaultItems,
  showSearch,
  onContextMenu,
  searchPlaceholder,
  emptyMessage,
  noMargin
}: SidebarListProps<any>) => {
  const [contextOpenViewId, setContextOpenViewId] = useState<string>(null)
  const [search, setSearch] = useState('')
  const [listItems, setListItems] = useState(items)

  const [selected, setSelected] = useState<number>(-1)

  const [source, target] = useSingleton()

  const inputRef = useRef<HTMLInputElement>(null)
  const expandSidebar = useLayoutStore((store) => store.expandSidebar)

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const reset = () => {
    setSearch('')
    setListItems(items)
    setSelected(-1)
    const inpEl = inputRef.current
    if (inpEl) inpEl.value = ''
    setContextOpenViewId(null)
  }
  const onSelectItem = (id: string) => {
    setSelected(-1)
    setContextOpenViewId(null)
    onClick(id)
  }

  useEffect(() => {
    if (showSearch) {
      if (search && search !== '') {
        const filtered = fuzzySearch(items, search, (item) => item.label)
        mog('Search', { search, filtered })
        setListItems(filtered)
      }
      if (search === '') {
        setListItems(items)
      }
    }
  }, [search, showSearch, items])
  useEffect(() => {
    if (inputRef.current) {
      const unsubscribe = tinykeys(inputRef.current, {
        Escape: (event) => {
          // event.stopPropagation()
          reset()
        },
        Enter: (event) => {
          event.stopPropagation()
          if (selected >= 0) {
            const item = listItems[selected]
            if (item) {
              onSelectItem(item.id)
            }
          }
        },
        ArrowDown: (event) => {
          event.stopPropagation()
          // Circular increment
          setSelected((selected + 1) % listItems.length)

          // if (selected < listItems.length - 1) {
          //   setSelected(selected + 1)
          // }
        },
        ArrowUp: (event) => {
          event.stopPropagation()
          // Circular decrement with no negative
          setSelected((selected - 1 + listItems.length) % listItems.length)
          // setSelected((selected - 1) % listItems.length)
          // if (selected > 0) {
          //   setSelected(selected - 1)
          // }
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [listItems, selected])

  useEffect(() => {
    if (!inputRef.current?.isContentEditable) {
      const unsubscribe = tinykeys(window, {
        Slash: (event) => {
          if (!isOnEditableElement(event)) {
            event.preventDefault()
            expandSidebar()
            if (inputRef) inputRef.current.focus()
          }
        }
      })

      return () => unsubscribe()
    }
  }, [])

  return (
    <SidebarListWrapper noMargin={noMargin}>
      <Tippy theme="mex" placement="right" singleton={source} />

      {defaultItems &&
        defaultItems.map((defaultItem) => (
          <StyledTreeItem key={defaultItem.id} noSwitcher selected={selectedItemId === defaultItem.id}>
            <ItemContent onClick={() => onSelectItem(defaultItem.id)}>
              <ItemTitle>
                <IconDisplay icon={defaultItem.icon} />
                <span>{defaultItem.label}</span>
              </ItemTitle>
            </ItemContent>
          </StyledTreeItem>
        ))}

      {showSearch && items.length > 0 && (
        <SidebarListFilter noMargin={noMargin}>
          <Icon icon={searchLine} />
          <Input
            placeholder={searchPlaceholder ?? 'Filter items'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
            // onKeyUp={debounce(onKeyUpSearch, 250)}
          />
        </SidebarListFilter>
      )}

      <FilteredItemsWrapper hasDefault={!!defaultItems}>
        {listItems.map((item, index) => (
          <SidebarListItemComponent
            key={item.id}
            tippyTarget={target}
            item={item}
            index={index}
            onContextMenu={onContextMenu}
            select={{
              selectedItemId: selectedItemId,
              selectIndex: selected,
              onSelect: onSelectItem
            }}
            // To render the context menu if the item is right-clicked
            contextMenu={{
              ItemContextMenu: ItemContextMenu,
              setContextOpenViewId: setContextOpenViewId,
              contextOpenViewId: contextOpenViewId
            }}
          />
        ))}
        {listItems.length === 0 && search !== '' && <EmptyMessage>{emptyMessage ?? 'No Items Found'}</EmptyMessage>}
      </FilteredItemsWrapper>
    </SidebarListWrapper>
  )
}

export default SidebarList
