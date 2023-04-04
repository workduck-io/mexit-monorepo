import { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import Tippy, { useSingleton } from '@tippyjs/react'
import { debounce } from 'lodash'

import { tinykeys } from '@workduck-io/tinykeys'

import { fuzzySearch, getParentEntity, useLayoutStore, useTreeStore } from '@mexit/core'
import {
  EmptyMessage,
  FilteredItemsWrapper,
  IconDisplay,
  Input,
  isOnEditableElement,
  ItemContent,
  ItemTitle,
  SidebarListFilter,
  SidebarListWrapper,
  StyledTreeItem
} from '@mexit/shared'

import { useViewStore } from '../../Stores/useViewStore'
import { SortableTree } from '../Tree'
import { FlattenedItem } from '../Tree/types'
import { buildPartialTree, buildTree, flattenTree } from '../Tree/utilities'

const SidebarViewTree = ({ defaultItems, onClick, onContextMenu }) => {
  const [source, target] = useSingleton()
  const [tree, setTree] = useState([])
  const [filtered, setFiltered] = useState<{ filteredTree: any; matchedFlatItems: any }>({
    filteredTree: undefined,
    matchedFlatItems: []
  })

  const views = useViewStore((store) => store.views)
  const inputRef = useRef<HTMLInputElement>(null)
  const activeId = useViewStore((s) => s.currentView?.id)
  const [search, setSearch] = useState('')
  const expandSidebar = useLayoutStore((store) => store.expandSidebar)
  const [selected, setSelected] = useState<number>(-1)
  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    const items = views.reduce((acc, view) => {
      const parent = getParentEntity(view.path)?.parent
      const expanded = useTreeStore.getState().expanded

      return [
        ...acc,
        {
          id: view.id,
          parentId: parent,
          properties: {
            label: view.title,
            path: view.path
          },
          depth: 0,
          index: 0,
          collapsed: !expanded.includes(view.id),
          children: []
        }
      ]
    }, [] as FlattenedItem[])

    setTree(buildTree(items))
  }, [views])

  useEffect(() => {
    if (search !== '') {
      const items = flattenTree(tree)
      const matchedFlatItems = fuzzySearch(items, search, (item) => item.properties.label)
      const filteredTree = buildPartialTree(matchedFlatItems, items)

      setFiltered({ filteredTree, matchedFlatItems })
    } else {
      setFiltered({ filteredTree: undefined, matchedFlatItems: [] })
    }
  }, [search])

  const reset = () => {
    setSearch('')
    setSelected(-1)
    const inpEl = inputRef.current
    if (inpEl) inpEl.value = ''
  }

  const selectedItem = useMemo(() => {
    if (selected >= 0 && filtered.matchedFlatItems.length > 0 && filtered.matchedFlatItems.length > selected) {
      return filtered.matchedFlatItems[selected]
    } else return undefined
  }, [selected, filtered.matchedFlatItems])

  useEffect(() => {
    if (inputRef.current) {
      const unsubscribe = tinykeys(inputRef.current, {
        Escape: (event) => {
          // event.stopPropagation()
          reset()
        },

        Enter: (event) => {
          // event.stopPropagation()
          if (selected >= 0) {
            if (selectedItem) {
              onClick(selectedItem.id)
            }
          }
        },
        ArrowDown: (event) => {
          event.stopPropagation()
          event.preventDefault()
          // Circular increment
          const newSelected = (selected + 1) % filtered.matchedFlatItems.length
          if (newSelected >= 0) {
            setSelected(newSelected)
          }
        },
        ArrowUp: (event) => {
          event.preventDefault()

          event.stopPropagation()
          // Circular decrement with no negative
          const newSelected = (selected - 1 + filtered.matchedFlatItems.length) % filtered.matchedFlatItems.length
          if (newSelected >= 0) {
            setSelected(newSelected)
          }
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [filtered.matchedFlatItems, selected])

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
    <SidebarListWrapper noMargin>
      <Tippy theme="mex" placement="right" singleton={source} />

      <div>
        {defaultItems &&
          defaultItems.map((defaultItem) => (
            <StyledTreeItem selected={activeId === defaultItem.id} key={defaultItem.id} noSwitcher>
              <ItemContent onClick={() => onClick(defaultItem.id)}>
                <ItemTitle>
                  <IconDisplay icon={defaultItem.icon} />
                  <span>{defaultItem.label}</span>
                </ItemTitle>
              </ItemContent>
            </StyledTreeItem>
          ))}
      </div>

      {tree.length > 0 && (
        <SidebarListFilter noMargin>
          <Icon icon={searchLine} />
          <Input placeholder={'Find Views...'} onChange={debounce((e) => onSearchChange(e), 250)} ref={inputRef} />
        </SidebarListFilter>
      )}

      <FilteredItemsWrapper hasDefault={!!defaultItems}>
        <SortableTree
          items={filtered.filteredTree ?? tree}
          setItems={setTree}
          onClick={onClick}
          activeId={activeId}
          highlightedId={filtered.matchedFlatItems[selected]?.id}
          onContextMenu={onContextMenu}
          collapsible
          indicator
          indentationWidth={16}
        />
        {tree.length === 0 && search !== '' && <EmptyMessage>{'No Items Found'}</EmptyMessage>}
      </FilteredItemsWrapper>
    </SidebarListWrapper>
  )
}

export default SidebarViewTree
