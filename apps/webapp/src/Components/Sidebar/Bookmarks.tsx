import React, { useEffect } from 'react'
import styled from 'styled-components'
import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'

import { HoverSubtleGlow } from '@mexit/shared'

import { useBookmarks } from '../../Hooks/useBookmarks'
import { useNavigation } from '../../Hooks/useNavigation'
import { useDataStore, useLinks } from '@workduck-io/mex-editor'

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

const BList = styled.div`
  max-height: 15rem;
  list-style: none;
  overflow-x: hidden;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.small};
`

const BLink = styled(BaseLink)`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
  margin: 0 0 ${({ theme }) => theme.spacing.tiny};
  svg {
    margin-right: ${({ theme }) => theme.spacing.tiny};
    color: ${({ theme }) => theme.colors.text.fade};
  }
  &:hover {
    svg {
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    }
  }
`

const Bookmarks = () => {
  const bookmarks = useDataStore((store) => store.bookmarks)
  const { getAllBookmarks } = useBookmarks()
  const { getPathFromNodeid } = useLinks()
  const { push } = useNavigation()
  // const [ bookmarks, setBookmarks ] = useState<string[]>([])

  useEffect(() => {
    // ssetBookmarks(
    getAllBookmarks()
  }, [])

  return (
    <BList>
      {bookmarks.map((nodeid) => {
        if (getPathFromNodeid(nodeid) === undefined) return null
        return (
          <BLink key={`bookmark_link_${nodeid}`} onClick={() => push(nodeid)}>
            <Icon height={14} icon={bookmarkLine} />
            {getPathFromNodeid(nodeid)}
          </BLink>
        )
      })}
    </BList>
  )
}

export default Bookmarks
