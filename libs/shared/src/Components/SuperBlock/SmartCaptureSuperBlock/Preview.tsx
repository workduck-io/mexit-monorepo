import React, { useMemo } from 'react'

import { useContentStore } from '@mexit/core'

import { ListContainer } from '../../VirtualList'

export const BlockEditors = ({ id = undefined, EditorRenderer }) => {
  const getContent = useContentStore((s) => s.getContent)

  const content = useMemo(() => {
    if (id) return getContent(id)
  }, [id])

  return (
    <ListContainer>
      {content.map((item) => (
        <EditorRenderer key={item.id} content={[item]} editorId={item.id} />
      ))}
    </ListContainer>
  )
}
