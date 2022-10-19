import React, { useEffect, useMemo, useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import fuzzysort from 'fuzzysort'
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
  // const [search, setSearch] = useState('')
  // const inputRef = useRef<HTMLInputElement>(null)
  const highlighted = useHighlightStore((state) => state.highlighted)
  // const [searchedHighlights, setSearchedHighlights] = useState<SourceHighlights>()

  const pageHighlights = useMemo(() => {
    return highlighted[window.location.href]
  }, [highlighted, window.location])

  // TODO: add highlight search later
  // const searchableHighlights = useMemo(() => {
  //   if (!pageHighlights) return

  //   return Object.values(pageHighlights).map((item) => ({
  //     nodeId: item.nodeId,
  //     ...item.elementMetadata.saveableRange
  //   }))
  // }, [pageHighlights])

  // const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  //   setSearch(e.target.value)
  // }

  // TODO: add highlight search
  // const onSearch = async (newSearchTerm: string) => {
  //   const res = fuzzysort.go(newSearchTerm, searchableHighlights, { all: true, key: 'text' }).map((item) => item.obj.nodeId)

  //   mog('res', { res, searchableHighlights })
  // }

  // useEffect(() => {
  //   if (search && search !== '') {
  //     onSearch(search)
  //   }

  // }, [search])

  return (
    <SnippetCards>
      <ShortenerComponent />
      {/* <SidebarListFilterWrapper>
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
      </SidebarListFilterWrapper> */}
      <HighlightGroups highlights={pageHighlights} />
    </SnippetCards>
  )
}
