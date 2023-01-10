import React from 'react'

import { DefaultMIcons } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useSnippetStore } from '../../Stores/useSnippetStore'

import { SidebarWrapper } from './Sidebar.style'
import SidebarList from './SidebarList'

type SnippetListProps = {
  type: 'snippet' | 'template'
}

const SnippetList: React.FC<SnippetListProps> = ({ type = 'snippet' }) => {
  const snippets = useSnippetStore((store) => store.snippets)
  const currentSnippet = useSnippetStore((store) => store.editor.snippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { goTo } = useRouting()

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
    const snippet = snippets[id]
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title: snippet?.title })
  }

  const heading = type === 'snippet' ? 'Snippets' : 'Templates'

  const sortedSnippets = React.useMemo(() => {
    return Object.values(snippets ?? {})
      .filter((s) => (type === 'template' ? s.template : !s.template))
      .sort((a, b) => (a.title < b.title ? 1 : -1))
      .map((snippet) => ({
        id: snippet.id,
        label: snippet.title,
        icon: snippet?.template ? DefaultMIcons.TEMPLATE : DefaultMIcons.SNIPPET,
        data: snippet
      }))
  }, [snippets])

  return (
    <SidebarWrapper>
      {/* <SidebarHeaderLite title={`Snippets (${sortedSnippets.length})`} icon={quillPenLine} /> */}
      <SidebarList
        items={sortedSnippets}
        onClick={onOpenSnippet}
        selectedItemId={currentSnippet?.id}
        showSearch
        searchPlaceholder={`Filter ${heading}...`}
        emptyMessage={`No ${heading} Found`}
      />
    </SidebarWrapper>
  )
}

export default SnippetList
