import React, { useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'

import { Infobox } from '@workduck-io/mex-components'

import { Snippet } from '@mexit/core'
import { SnippetCards, Input, SidebarListFilter, SidebarListFilterWrapper, SnippetSidebarHelp } from '@mexit/shared'

import { useSnippets } from '../../Hooks/useSnippets'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { insertSnippet } from '../Dibba'
import SnippetCard from './SnippetCard'

export const SnippetsInfoBar = () => {
  const [search, setSearch] = useState('')
  const snippets = useSnippetStore((state) => state.snippets)
  const getSnippet = useSnippets().getSnippet
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchedSnippets, setSearchSnippets] = useState<Snippet[]>(snippets)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  // TODO: add search through worker
  const onSearch = async (newSearchTerm: string) => {}

  const onInsertSnippet = (snippetId: string) => {
    const snippet = getSnippet(snippetId)

    insertSnippet(snippet)
  }

  return (
    <SnippetCards>
      <SidebarListFilterWrapper>
        <SidebarListFilter>
          <Icon icon={searchLine} />
          <Input
            autoFocus
            placeholder={'Search snippets'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
          />
        </SidebarListFilter>
        <Infobox text={SnippetSidebarHelp} />
      </SidebarListFilterWrapper>
      {searchedSnippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          keyStr={snippet.id}
          snippet={snippet}
          onClick={() => onInsertSnippet(snippet.id)}
        />
      ))}
    </SnippetCards>
  )
}
