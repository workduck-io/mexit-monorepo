import React, { useEffect, useState } from 'react'
import bookmarkFill from '@iconify/icons-ri/bookmark-fill'
import bookmarkLine from '@iconify/icons-ri/bookmark-line'
import { Icon } from '@iconify/react'

import { LoadingButton } from './Buttons'
import { useBookmarks } from '../../Hooks/useBookmarks'
import { useDataStore } from '../../Stores/useDataStore'

interface BookmarkButtonProps {
  nodeid: string
}

const BookmarkButton = ({ nodeid }: BookmarkButtonProps) => {
  const { isBookmark, addBookmark, removeBookmark } = useBookmarks()
  const bookmarks = useDataStore((store) => store.bookmarks)
  const [bmed, setBmed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const con = isBookmark(nodeid)
    setBmed(con)
  }, [nodeid])

  const onBookmark = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    if (isBookmark(nodeid)) {
      // console.log('Removing')
      await removeBookmark(nodeid)
      setBmed(false)
    } else {
      // console.log('Adding')
      await addBookmark(nodeid)
      setBmed(true)
    }
    setLoading(false)
  }

  return (
    <LoadingButton dots={2} loading={loading} buttonProps={{ highlight: bmed, onClick: onBookmark, transparent: true }}>
      <Icon width={24} icon={bmed ? bookmarkFill : bookmarkLine} />
    </LoadingButton>
  )
}

export default BookmarkButton
