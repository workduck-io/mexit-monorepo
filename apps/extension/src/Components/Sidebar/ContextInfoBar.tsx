import React, { useEffect, useMemo, useRef, useState } from 'react'

import edit2Line from '@iconify/icons-ri/edit-2-line'
import linkM from '@iconify/icons-ri/link-m'
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
  HighlightSidebarHelp,
  CenteredFlex
} from '@mexit/shared'

import { useHighlightStore } from '../../Stores/useHighlightStore'
import { getElementById } from '../../contentScript'
import { GenericCard } from './GenericCard'
import { HighlightGroups } from './HighlightGroup'
import { ShortenerComponent } from './ShortenerComponent'

// TODO: add links to onboarding tutorials later
// and maybe a check if the user doesn't want to see a card again
const basicOnboarding = [
  {
    icon: 'ri:link-m',
    title: 'Shorten URLs and Tag them',
    description: 'Create shortcuts for important URLs and tag them to organize'
  },
  {
    icon: 'ri:edit-2-line',
    title: 'Highlight Content',
    description:
      'Select and open Spotlight to create a highlight and save it in a note. Highlights are shown here in the sidebar'
  },
  {
    icon: 'lucide:highlighter',
    title: 'Use your knowledge everywhere',
    description: 'Use [[ to link to your public notes, use snippets and insert website shortcuts that you have created'
  }
]

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
      {pageHighlights ? (
        <HighlightGroups highlights={pageHighlights} />
      ) : (
        <div>
          <CenteredFlex>
            <h2>Hi there</h2>
            <p>Let's get you started</p>
          </CenteredFlex>
          <SnippetCards>
            {basicOnboarding.map((item) => (
              <GenericCard icon={item.icon} title={item.title} description={item.description} />
            ))}
          </SnippetCards>
        </div>
      )}
    </SnippetCards>
  )
}
