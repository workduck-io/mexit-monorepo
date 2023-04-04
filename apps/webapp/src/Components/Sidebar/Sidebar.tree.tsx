import React, { useEffect, useMemo, useState } from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'
import { useTheme } from 'styled-components'

import { tinykeys } from '@workduck-io/tinykeys'

import { defaultContent, fuzzySearch, ILink, useLayoutStore } from '@mexit/core'
import { Input, isOnEditableElement, MexIcon, SidebarListFilter } from '@mexit/shared'

import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { getTitleFromPath } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { getPartialTreeFromLinks, getTreeFromLinks } from '../../Hooks/useTreeFromLinks'

import { CreateNewNoteSidebarButton, MexTreeWrapper, SpaceList } from './Sidebar.style'
import Tree from './Tree'

interface SpaceTreeProps {
  spaceId: string
  items: ILink[]
  filterText?: string
  publicILink?: boolean
  readOnly?: boolean
}

/**
 * Tree for mex
 *
 * - Displayes items in a Tree
 * - Filterable
 */
export const MexTree = ({ items, filterText, spaceId, publicILink, readOnly }: SpaceTreeProps) => {
  /* To Add
   *
   * - MultiSelect
   * - Drop to Different space
   */

  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number>(-1)
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const { push } = useNavigation()
  const theme = useTheme()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const expandSidebar = useLayoutStore((store) => store.expandSidebar)

  const initTree = useMemo(() => getTreeFromLinks(items), [items])

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const getFilteredData = (search) => {
    const filteredItems: ILink[] = fuzzySearch(items, search, (item) => getTitleFromPath(item.path))
    const { tree, matchedFlatItems } = getPartialTreeFromLinks(filteredItems, items)
    return { tree, matchedFlatItems }
  }

  const { filteredTree, matchedFlatItems } = useMemo(() => {
    if (search !== '') {
      const { tree, matchedFlatItems } = getFilteredData(search)
      // mog('Search', { tree, matchedFlatItems })
      return { filteredTree: tree, matchedFlatItems }
    } else {
      return { filteredTree: undefined, matchedFlatItems: [] }
    }
  }, [search, items])

  const reset = () => {
    setSearch('')
    setSelected(-1)
    const inpEl = inputRef.current
    if (inpEl) inpEl.value = ''
  }

  const selectedItem = useMemo(() => {
    if (selected >= 0 && matchedFlatItems.length > 0 && matchedFlatItems.length > selected) {
      return matchedFlatItems[selected]
    } else return undefined
  }, [selected, matchedFlatItems])

  const onOpenItem = (nodeid: string) => {
    push(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const createNewNoteInNamespace = () => {
    // mog('New Note', { spaceId })
    const note = createNewNote({ namespace: spaceId, noteContent: defaultContent.content })
    goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
    // updater({
    //   id: note?.nodeid,
    //   namespaceId: namespaceId,
    // })
  }

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
            // Select the item
            // const item = listItems[selected]
            if (selectedItem) {
              onOpenItem(selectedItem.data.nodeid)
            }
          }
        },
        ArrowDown: (event) => {
          event.stopPropagation()
          event.preventDefault()
          // Circular increment
          const newSelected = (selected + 1) % matchedFlatItems.length
          if (newSelected >= 0) {
            setSelected(newSelected)
          }
        },
        ArrowUp: (event) => {
          event.preventDefault()

          event.stopPropagation()
          // Circular decrement with no negative
          const newSelected = (selected - 1 + matchedFlatItems.length) % matchedFlatItems.length
          if (newSelected >= 0) {
            setSelected(newSelected)
          }
        }
      })

      return () => {
        unsubscribe()
      }
    }
  }, [matchedFlatItems, selected])

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

  // mog('Selected', { matchedFlatItems, selected, selectedItem })

  return (
    <MexTreeWrapper>
      {items.length > 0 ? (
        <>
          <SidebarListFilter>
            <Icon icon={searchLine} />
            <Input
              transparent
              placeholder={filterText ?? 'Filter items'}
              onChange={debounce((e) => onSearchChange(e), 250)}
              ref={inputRef}
            />
            <MexIcon $noHover fontSize="1.2rem" icon="bi:slash-square-fill" color={theme.tokens.text.fade} />
          </SidebarListFilter>
          <SpaceList>
            <Tree
              initTree={filteredTree ? filteredTree : initTree}
              readOnly={readOnly}
              selectedItemId={selectedItem?.data?.nodeid}
            />
          </SpaceList>
        </>
      ) : (
        <>
          <CreateNewNoteSidebarButton onClick={createNewNoteInNamespace}>
            <Icon width={24} icon={addCircleLine} />
            New Note
          </CreateNewNoteSidebarButton>
        </>
      )}
    </MexTreeWrapper>
  )
}
