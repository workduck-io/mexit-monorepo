import React, { useEffect, useMemo, useState } from 'react'

import { useBookmarks } from '../../Hooks/useBookmarks'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { SStarNoteButton } from '../Sidebar/Sidebar.style'
import starLine from '@iconify/icons-ri/star-line'
import { Icon } from '@iconify/react'

const StarNoteButton = () => {
  const node = useEditorStore((s) => s.node)
  const { isBookmark, addBookmark, removeBookmark } = useBookmarks()
  const [bmed, setBmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const { getPathFromNodeid } = useLinks()

  const nodeid = node?.nodeid ?? ''

  const bookmarks = useDataStore((state) => state.bookmarks)

  useEffect(() => {
    const con = isBookmark(nodeid)
    setBmed(con)
  }, [nodeid, bookmarks])

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

  const noteTitle = useMemo(() => {
    return getTitleFromPath(getPathFromNodeid(node.nodeid))
  }, [node])

  return (
    <SStarNoteButton dots={5} loading={loading} highlight={bmed} onClick={onBookmark} transparent={false}>
      <Icon width={24} icon={starLine} />
      <span>
        Star <span className="noteTitle">{noteTitle}</span>
      </span>
    </SStarNoteButton>
  )
}

export default StarNoteButton
