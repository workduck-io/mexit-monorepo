import React, { useRef, useState, useEffect } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'

import { Infobox } from '@workduck-io/mex-components'

import { mog, Snippet } from '@mexit/core'
import { SnippetCards, Input, SidebarListFilter, SidebarListFilterWrapper, SnippetSidebarHelp } from '@mexit/shared'

import { useSnippets } from '../../Hooks/useSnippets'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { insertSnippet } from '../Dibba'
import SnippetCard from './SnippetCard'
import useRaju from '../../Hooks/useRaju'

export const SnippetsInfoBar = () => {
  const [search, setSearch] = useState('')
  const snippets = useSnippetStore((state) => state.snippets)
  const getSnippet = useSnippets().getSnippet
  const inputRef = useRef<HTMLInputElement>(null)
  const { dispatch } = useRaju()
  const [searchedSnippets, setSearchedSnippets] = useState<Snippet[]>(snippets)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const onInsertSnippet = (snippetId: string) => {
    const snippet = getSnippet(snippetId)

    insertSnippet(snippet)
  }

  const onSearch = async (newSearchTerm: string) => {
    const res = await dispatch('SEARCH', ['template', 'snippet'], newSearchTerm)

    if (newSearchTerm === '' && res.length === 0) {
      setSearchedSnippets(snippets)
    } else {
      const searched = res.map((r) => {
        const snippet = snippets.find((snippet) => snippet.id === r.id)

        return snippet
      }).filter((s) => s !== undefined) as Snippet[]

      setSearchedSnippets(searched)
    }
  }

  useEffect(() => {
    if (search && search !== '') {
      onSearch(search)
    }

    if (search === '') {
      setSearchedSnippets(snippets)
    }

  }, [search, snippets])

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
      {searchedSnippets?.map((snippet) => (
        <SnippetCard
          key={snippet?.id}
          keyStr={snippet?.id}
          snippet={snippet}
          onClick={() => onInsertSnippet(snippet.id)}
        />
      ))}
    </SnippetCards>
  )
}
