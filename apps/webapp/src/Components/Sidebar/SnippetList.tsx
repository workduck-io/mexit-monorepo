import React from 'react'

import { useRecentsStore, userPreferenceStore as useUserPreferenceStore, useSnippetStore } from '@mexit/core'
import { DefaultMIcons } from '@mexit/shared'

import { useUserService } from '../../Hooks/API/useUserAPI'
import { useNavigation } from '../../Hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

import SidebarList from './SidebarList'

type SnippetListProps = {
  type: 'snippet' | 'template'
}

const SnippetList: React.FC<SnippetListProps> = ({ type = 'snippet' }) => {
  const snippets = useSnippetStore((store) => store.snippets)
  const currentSnippet = useSnippetStore((store) => store.editor.snippet)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { goTo } = useRouting()
  const { push } = useNavigation()
  const setLastOpened = useUserPreferenceStore((state) => state.setLastOpened)
  const { updateUserPreferences } = useUserService()

  const onOpenSnippet = (id: string) => {
    console.log('Opening snippet', id)
    push(id)
    loadSnippet(id)
    const snippet = snippets[id]
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title: snippet?.title })

    const lastOpened = useRecentsStore.getState().lastOpened
    setLastOpened(lastOpened)
    updateUserPreferences()
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
    <SidebarList
      items={sortedSnippets}
      onClick={onOpenSnippet}
      selectedItemId={currentSnippet?.id}
      showSearch
      noMargin
      searchPlaceholder={`Filter ${heading}...`}
      emptyMessage={`No ${heading} Found`}
    />
  )
}

export default SnippetList
