import React, { useEffect, useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce } from 'lodash'

import { MEXIT_FRONTEND_URL_BASE, mog } from '@mexit/core'
import { SidebarListFilterWrapper, SidebarListFilter, Input, SnippetCards, copyTextToClipboard } from '@mexit/shared'

import useRaju from '../../Hooks/useRaju'
import useDataStore from '../../Stores/useDataStore'
import { NodeCard } from './NodeCard'

export const NotesInfoBar = () => {
  const publicNodes = useDataStore((state) => state.publicNodes)
  const [search, setSearch] = useState('')
  const [searchedNodes, setSearchedNodes] = useState<string[]>()
  const { dispatch } = useRaju()

  const inputRef = useRef<HTMLInputElement>(null)

  const onClick = async (nodeId: string) => {
    await copyTextToClipboard(`${MEXIT_FRONTEND_URL_BASE}/share/${nodeId}`)
  }

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const onSearch = async (newSearchTerm: string) => {
    const res = await dispatch('SEARCH', ['node'], newSearchTerm)
    mog('node search results', { res, newSearchTerm })

    setSearchedNodes(res?.map((item) => item.id))
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
          <Icon icon={searchLine} />
          <Input
            autoFocus
            placeholder={'Search Notes'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
          />
        </SidebarListFilter>
      </SidebarListFilterWrapper>
      {searchedNodes?.map((nodeId) => (
        <NodeCard key={nodeId} nodeId={nodeId} onClick={onClick} />
      ))}
    </SnippetCards>
  )
}
