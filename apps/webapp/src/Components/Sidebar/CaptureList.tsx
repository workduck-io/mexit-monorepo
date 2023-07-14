import React from 'react'

import { RecentType, useLinkStore, useRecentsStore, useSnippetStore } from '@mexit/core'
import { DefaultMIcons } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

import SidebarList from './SidebarList'

type SnippetListProps = {
  type: 'snippet' | 'template'
}

type CaptureListProps = {
  type: 'capture' | 'link'
}

const CaptureList: React.FC<SnippetListProps> = ({ type = 'capture' }) => {
  const snippets = useSnippetStore((store) => store.snippets)
  const captures = useLinkStore((store) => store.links)
  console.log(captures)
  console.log('captures', captures)
  const currentSnippet = useSnippetStore((store) => store.editor.snippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { goTo } = useRouting()
  const addRecent = useRecentsStore((store) => store.addRecent)

  const onOpenSnippet = (id: string) => {
    addRecent(RecentType.snippet, id)
    loadSnippet(id)
    const snippet = snippets[id]
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title: snippet?.title })
  }

  const heading = type === 'capture' ? 'Captures' : 'Links'

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
    <>
      <SidebarList
        items={sortedSnippets}
        onClick={onOpenSnippet}
        selectedItemId={currentSnippet?.id}
        showSearch
        noMargin
        searchPlaceholder={`Filter ${heading}...`}
        emptyMessage={`No ${heading} Found`}
      />
    </>
  )
}

export default CaptureList
