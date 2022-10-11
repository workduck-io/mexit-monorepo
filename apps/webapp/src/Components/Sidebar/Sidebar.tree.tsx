import React, { useEffect, useMemo, useState } from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'

import { tinykeys } from '@workduck-io/tinykeys'

import { defaultContent, ILink } from '@mexit/core'
import { Input } from '@mexit/shared'

import { useCreateNewNote } from '../../Hooks/useCreateNewNote'
import { getTitleFromPath } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { getTreeFromLinks, getPartialTreeFromLinks } from '../../Hooks/useTreeFromLinks'
import { useEditorStore } from '../../Stores/useEditorStore'
import { usePublicNodeStore } from '../../Stores/usePublicNodes'
import { fuzzySearch } from '../../Utils/fuzzysearch'
import { CreateNewNoteSidebarButton, MexTreeWrapper, SpaceList } from './Sidebar.style'
import { SidebarListFilter } from './SidebarList.style'
import Tree from './Tree'

interface SpaceTreeProps {
  spaceId: string
  items: ILink[]
  filterText?: string
  publicILink?: boolean
}

/**
 * Tree for mex
 *
 * - Displayes items in a Tree
 * - Filterable
 */
export const MexTree = ({ items, filterText, spaceId, publicILink }: SpaceTreeProps) => {
  /* To Add
   *
   * - MultiSelect
   * - Drop to Different space
   */
  const editorNode = useEditorStore((store) => store.node)
  const publicNode = usePublicNodeStore((store) => store.currentNode)
  const node = publicILink ? publicNode : editorNode
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<number>(-1)
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const { push } = useNavigation()

  const inputRef = React.useRef<HTMLInputElement>(null)

  const initTree = useMemo(() => getTreeFromLinks(items), [node, items])

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
          event.stopPropagation()
          reset()
        },
        Enter: (event) => {
          event.stopPropagation()
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
          // Circular increment
          const newSelected = (selected + 1) % matchedFlatItems.length
          if (newSelected >= 0) {
            setSelected(newSelected)
          }
        },
        ArrowUp: (event) => {
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

  // mog('Selected', { matchedFlatItems, selected, selectedItem })

  return (
    <MexTreeWrapper>
      {items.length > 0 ? (
        <>
          <SidebarListFilter>
            <Icon icon={searchLine} />
            <Input
              placeholder={filterText ?? 'Filter items'}
              onChange={debounce((e) => onSearchChange(e), 250)}
              ref={inputRef}
              // onKeyUp={debounce(onKeyUpSearch, 250)}
            />
          </SidebarListFilter>
          <SpaceList>
            <Tree initTree={filteredTree ? filteredTree : initTree} selectedItemId={selectedItem?.data?.nodeid} />
          </SpaceList>
        </>
      ) : (
        <CreateNewNoteSidebarButton onClick={createNewNoteInNamespace}>
          <Icon width={24} icon={addCircleLine} />
          Create a new note
        </CreateNewNoteSidebarButton>
      )}
    </MexTreeWrapper>
  )
}
