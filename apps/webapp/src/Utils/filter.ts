import { useMemo } from 'react'

import { ELEMENT_INLINE_BLOCK,ELEMENT_SYNC_BLOCK, NodeEditorContent, TodoStatus, TodoType, useEditorStore } from '@mexit/core'


export type ContentBlockType = typeof ELEMENT_SYNC_BLOCK | typeof ELEMENT_INLINE_BLOCK

export type FilterContentType = {
  filter?: string
  type: ContentBlockType
}

export const filterContent = (content: NodeEditorContent, blocks: NodeEditorContent, filter) => {
  content.forEach((element) => {
    if (element.type === filter.type) {
      blocks.push(element)
    }

    if (element.children && element.children.length > 0) {
      filterContent(element.children, blocks, filter)
    }
  })
}

export const useFilteredContent = (filter: FilterContentType) => {
  const content = useEditorStore((state) => state.content)

  const elements = useMemo(() => {
    const data: NodeEditorContent = []
    filterContent(content[0].content, data, filter)
    return data
  }, [content])

  return { elements }
}

export const filterIncompleteTodos = (todo: TodoType) => {
  if (todo?.metadata?.status === TodoStatus?.completed) {
    return false
  }
  return true
}
