import React from 'react'

import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { SidebarHeaderLite } from './Sidebar.space.header'
import { SidebarWrapper } from './Sidebar.style'
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
        label: snippet.title,
        icon: snippet.template ? magicLine : quillPenLine,
        data: snippet
      }))
  }, [snippets])

  return (
    <SidebarWrapper>
      <SidebarHeaderLite title="Snippets" icon={quillPenLine} />
      <SidebarList
        items={sortedSnippets}
        onClick={onOpenSnippet}
        selectedItemId={currentSnippet?.id}
        showSearch
        searchPlaceholder="Filter Snippets..."
        emptyMessage="No Snippets Found"
      />
    </SidebarWrapper>
  )
}

export default SnippetList
