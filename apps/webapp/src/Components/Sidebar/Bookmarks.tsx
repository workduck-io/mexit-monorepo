import React from 'react'

import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'
import { useMatch } from 'react-router-dom'
import styled from 'styled-components'

import { HoverSubtleGlow, MexIcon } from '@mexit/shared'

import { useLinks } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useDataStore } from '../../Stores/useDataStore'
import SidebarList from './SidebarList'

export const BaseLink = styled.div`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-bottom: ${({ theme }) => theme.spacing.small};

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0px 2px 6px ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
  ${HoverSubtleGlow}
`

export const Centered = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`

const Bookmarks = () => {
  const bookmarks = useDataStore((store) => store.bookmarks)
  const { getPathFromNodeid } = useLinks()
  const { push } = useNavigation()
  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const { goTo } = useRouting()
  // const [ bookmarks, setBookmarks ] = useState<string[]>([])

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const bookmarkItems = bookmarks.map((nodeid) => ({
    id: nodeid,
    title: getPathFromNodeid(nodeid),
    icon: bookmarkLine
  }))

  return bookmarkItems.length > 0 ? (
    <SidebarList
      items={bookmarkItems}
      onClick={onOpenNode}
      selectedItemId={match?.params?.nodeid}
      showSearch
      searchPlaceholder="Filter bookmarks..."
      emptyMessage="No bookmarks found"
    />
  ) : (
    <Centered>
      <Icon icon={bookmarkLine} height={64} width={64} style={{ margin: '0 0 1rem 0' }} />
      <span>No bookmarks yet!</span>
    </Centered>
  )
}

export default Bookmarks
