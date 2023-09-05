import React, { useMemo } from 'react'

import { TestTemplateData, useContentStore } from '@mexit/core'

import { ListContainer } from '../../VirtualList'

export const BlockEditors = ({ id = undefined, EditorRenderer }) => {
  const getContent = useContentStore((s) => s.getContent)

  const content = useMemo(() => {
    return TestTemplateData.content
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
