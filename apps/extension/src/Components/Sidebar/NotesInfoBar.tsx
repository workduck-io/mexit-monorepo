import React, { useEffect, useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'

import { mog } from '@mexit/core'
import { SidebarListFilterWrapper, SidebarListFilter, Input, SnippetCards, MexIcon } from '@mexit/shared'

import useRaju from '../../Hooks/useRaju'
import useDataStore from '../../Stores/useDataStore'
import { NodeCard } from './NodeCard'

export const NotesInfoBar = () => {
  const publicNodes = useDataStore((state) => state.publicNodes)
  const [search, setSearch] = useState('')
  const [searchedNodes, setSearchedNodes] = useState<string[]>()
  const { dispatch } = useRaju()

  const inputRef = useRef<HTMLInputElement>(null)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const onSearch = async (newSearchTerm: string) => {
    try {
      const res = await dispatch('SEARCH', ['node'], newSearchTerm)
      const results = res?.map((item) => item.id) ?? []
      setSearchedNodes(results)
    } catch (err) {
      mog('[NOTE SEARCH]: Unable to search', { err })
    }
  }

  useEffect(() => {
    if (search !== '') {
      onSearch(search)
    } else {
      setSearchedNodes(publicNodes)
    }
  }, [search])

  return (
    <SnippetCards>
      <SidebarListFilterWrapper>
        <SidebarListFilter>
          <MexIcon height={20} width={20} icon={searchLine} />
          <Input
            autoFocus
            placeholder={'Search notes'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
          />
        </SidebarListFilter>
      </SidebarListFilterWrapper>
      {searchedNodes?.map((nodeId) => (
        <NodeCard key={nodeId} nodeId={nodeId} />
      ))}
    </SnippetCards>
  )
}
