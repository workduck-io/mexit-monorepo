import React, { useMemo } from 'react'

import { useBookmarks } from '../../Hooks/useBookmarks'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import StarNoteButton from '../Buttons/StarNoteButton'
import { PinnedList } from './Sidebar.style'
import SidebarListItemComponent from './SidebarListItem'
import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import starFill from '@iconify/icons-ri/star-fill'
import Tippy, { useSingleton } from '@tippyjs/react'
import styled from 'styled-components'

export const Centered = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`

const StarredNotes = () => {
  const bookmarks = useDataStore((store) => store.bookmarks)
  const { getPathFromNodeid } = useLinks()
  const { push } = useNavigation()
  const node = useEditorStore((s) => s.node)
  // const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const { goTo } = useRouting()
  // const [ bookmarks, setBookmarks ] = useState<string[]>([])
  const [source, target] = useSingleton()
  const { removeBookmark } = useBookmarks()

  const currentBmed = useMemo(() => {
    // mog('Bookmarked?', { con })
    return bookmarks.includes(node.nodeid)
  }, [node.nodeid, bookmarks])

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const bookmarkItems = bookmarks
    .map((nodeid) => ({
      id: nodeid,
      label: getTitleFromPath(getPathFromNodeid(nodeid)),
      icon: starFill,
      hoverIcon: closeCircleLine,

      onIconClick: (nodeid: string) => {
        removeBookmark(nodeid)
      },
      data: {}
    }))
    .filter((item) => item.label !== undefined)
    .reverse()
    .slice(0, 5)
    .reverse()

  // mog('Bookmarks', { bookmarks, bookmarkItems })

  return (
    <>
      <Tippy theme="mex" placement="right" singleton={source} />
      <PinnedList>
        {bookmarkItems.map((b, i) => (
          <SidebarListItemComponent
            key={`bookmark_${b.id}`}
            // @ts-ignore
            item={b}
            contextMenu={{
              setContextOpenViewId: () => undefined,
              contextOpenViewId: node.nodeid
            }}
            select={{
              onSelect: onOpenNode,
              selectIndex: -1,
              selectedItemId: ''
            }}
            index={i}
            tippyTarget={target}
          />
        ))}
        {bookmarkItems.length < 5 && <StarNoteButton />}
      </PinnedList>
    </>
  )
}

export default StarredNotes
