import React, { useEffect, useState } from 'react'

import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { debounce } from 'lodash'

import { tinykeys } from '@workduck-io/tinykeys'

import { fuzzySearch,MIcon, mog } from '@mexit/core'
import { IconDisplay,Input, SidebarListFilter } from '@mexit/shared'

import { ContextMenuItem, ContextMenuSubContent, ContextMenuSubTrigger, RightSlot } from '../../Style/contextMenu'

interface ContextMenuItem {
  id: string
  label: string
  icon?: MIcon
  disabled?: boolean
}

interface ContextMenuListWithFilterProps {
  item: ContextMenuItem
  items: ContextMenuItem[]
  disabled?: boolean
  filter?: boolean
  filterPlaceholder?: string
  onSelectItem: (id: string) => void
}

const ContextMenuListWithFilter = ({
  item,
  items,
  disabled = false,
  filter = false,
  filterPlaceholder = 'Filter',
  onSelectItem
}: ContextMenuListWithFilterProps) => {
  const [search, setSearch] = useState('')
  const [listItems, setListItems] = useState(items)

  const [selected, setSelected] = useState<number>(-1)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.target.focus()
    setSearch(e.target.value)
  }

  const reset = () => {
    setSearch('')
    setListItems(items)
    setSelected(-1)
    const inpEl = inputRef.current
    if (inpEl) inpEl.value = ''
  }

  const onSelectingItem = (id: string) => {
    setSelected(-1)
    onSelectItem(id)
  }

  useEffect(() => {
    if (filter) {
      if (search !== '') {
        const filtered = fuzzySearch(items, search, (item) => item.label)
        mog('Search', { search, filtered })
        setListItems(filtered)
      }
      if (search === '') {
        setListItems(items)
      }
    }
  }, [search, filter, items])

  useEffect(() => {
    if (inputRef.current) {
      const unsubscribe = tinykeys(inputRef.current, {
        Escape: (event) => {
          event.stopPropagation()
          reset()
        },
        Enter: (event) => {
          event.stopPropagation()
          if (selected >= 0) {
            const item = listItems[selected]
            if (item) {
              onSelectingItem(item.id)
            }
          }
        },
        ArrowDown: (event) => {
          event.stopPropagation()
          setSelected((selected + 1) % listItems.length)
        },
        ArrowUp: (event) => {
          event.stopPropagation()
          setSelected((selected - 1 + listItems.length) % listItems.length)
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [listItems, selected])

  return (
    <ContextMenuPrimitive.Sub
      onOpenChange={(open) => {
        if (!open) {
          reset()
        }
      }}
    >
      <ContextMenuSubTrigger disabled={disabled}>
        {item.icon && <IconDisplay icon={item.icon} />}
        {item.label}
        <RightSlot>
          <Icon icon={arrowRightSLine} />
        </RightSlot>
      </ContextMenuSubTrigger>

      <ContextMenuPrimitive.Portal>
        <ContextMenuSubContent sideOffset={2} alignOffset={-5}>
          {filter && items.length > 0 && (
            <SidebarListFilter>
              <Icon icon={searchLine} />
              <Input
                placeholder={filterPlaceholder}
                onChange={debounce((e) => onSearchChange(e), 250)}
                ref={inputRef}
                // onKeyUp={debounce(onKeyUpSearch, 250)}
              />
            </SidebarListFilter>
          )}

          {listItems.map((item, index) => (
            <ContextMenuItem
              disabled={item.disabled}
              selected={selected === index}
              onSelect={() => onSelectingItem(item.id)}
              key={`ContextMenuList_${item.id}`}
            >
              {item.icon && <IconDisplay icon={item.icon} />}
              {item.label}
            </ContextMenuItem>
          ))}
        </ContextMenuSubContent>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Sub>
  )
}

export default ContextMenuListWithFilter
