import React, { useEffect, useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce, reduce } from 'lodash'

import { Infobox } from '@workduck-io/mex-components'

import { mog, SingleHighlight, SourceHighlights } from '@mexit/core'
import {
  SnippetCards,
  SidebarListFilterWrapper,
  SidebarListFilter,
  Input,
  SnippetSidebarHelp,
  HighlightSidebarHelp
} from '@mexit/shared'

import { useHighlightStore } from '../../Stores/useHighlightStore'
import { getElementById } from '../../contentScript'
import { HighlightGroups } from './HighlightGroup'
import { ShortenerComponent } from './ShortenerComponent'

export function ContextInfoBar() {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const highlighted = useHighlightStore((state) => state.highlighted)
  const pageHighlights = highlighted[window.location.href]

  const [searchedHighlights, setSearchedHighlights] = useState<SourceHighlights>()

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  // TODO: add highlight search
  const onSearch = async (newSearchTerm: string) => {}

  return (
    <SnippetCards>
      <ShortenerComponent />
      <SidebarListFilterWrapper>
        <SidebarListFilter>
          <Icon icon={searchLine} />
          <Input
            autoFocus
            placeholder={'Search highlights'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
          />
        </SidebarListFilter>
        <Infobox root={getElementById('ext-side-nav')} text={HighlightSidebarHelp} />
      </SidebarListFilterWrapper>
      <HighlightGroups highlights={pageHighlights} />
    </SnippetCards>
  )
}
