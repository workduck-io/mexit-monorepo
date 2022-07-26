import React, { useMemo } from 'react'

import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'

import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import SidebarList from './SidebarList'

const SnippetList = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const currentSnippet = useSnippetStore((store) => store.editor.snippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { goTo } = useRouting()

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
    const snippet = snippets.find((snippet) => snippet.id === id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title: snippet?.title })
  }

  const sortedSnippets = React.useMemo(() => {
    return snippets
      .sort((a, b) => {
        if (a.title < b.title) {
          return -1
        }
        if (a.title > b.title) {
          return 1
        }
        return 0
      })
      .map((snippet) => ({
        id: snippet.id,
        title: snippet.title,
        icon: snippet.template ? magicLine : quillPenLine
      }))
  }, [snippets])

  return (
    <SidebarList
      items={sortedSnippets}
      onClick={onOpenSnippet}
      selectedItemId={currentSnippet?.id}
      showSearch
      searchPlaceholder="Filter Snippets..."
      emptyMessage="No Snippets Found"
    />
  )
}

export default SnippetList
