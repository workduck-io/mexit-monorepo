import React, { useEffect, useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import { debounce, reduce } from 'lodash'

import { Infobox } from '@workduck-io/mex-components'

import { mog, SourceHighlights } from '@mexit/core'
import { SnippetCards, SidebarListFilterWrapper, SidebarListFilter, Input, SnippetSidebarHelp } from '@mexit/shared'

import { useHighlightStore } from '../../Stores/useHighlightStore'
import { HighlightCard } from './HighlightCard'

export function ContextInfoBar() {
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const highlighted = useHighlightStore((state) => state.highlighted)

  const [pageHighlights, setPageHighlights] = useState<any>()
  const [searchedHighlights, setSearchedHighlights] = useState<SourceHighlights>()

  useEffect(() => {
    // This groups the highlights as a object with nodeId as index and highlights of that node in an array
    // TODO: Although need to sort this according to textOffset
    const groupedHighlights = reduce(
      highlighted[window.location.href],
      function (result, value, key) {
        value['blockId'] = key
        ;(result[value['nodeId']] || (result[value['nodeId']] = [])).push(value)

        return result
      },
      {}
    )

    // mog('grouped', { groupedHighlights })
    setPageHighlights(groupedHighlights)
  }, [window.location.href, highlighted])

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  // TODO: add highlight search
  const onSearch = async (newSearchTerm: string) => {}

  return (
    <SnippetCards>
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
        {/* TODO: add a copy for HighlightSidebarHelp */}
        {/* <Infobox text={SnippetSidebarHelp} /> */}
      </SidebarListFilterWrapper>
      {pageHighlights &&
        Object.keys(pageHighlights).map((key) => (
          <HighlightCard key={key} nodeId={key} highlights={pageHighlights[key]} />
        ))}
    </SnippetCards>
  )
}
