import fuzzysort from 'fuzzysort'
import React, { useEffect } from 'react'
import { ActionType, WDLogo } from '@mexit/shared'
import { defaultActions, initActions, searchBrowserAction } from '@mexit/shared'
import { CategoryType, useSputlitContext } from '../../Hooks/useSputlitContext'
import { CenterIcon, QuerySearch, StyledInput, StyledSearch } from './styled'

const Search = () => {
  const { search, setSearch, setSearchResults, activeItem } = useSputlitContext()

  useEffect(() => {
    if (search.value !== '') {
      const res = fuzzysort.go(search.value, initActions, { key: 'title' }).map((item) => item.obj)
      if (res.length === 0) setSearchResults([searchBrowserAction(search.value)])
      else setSearchResults(res)
    } else {
      setSearchResults(defaultActions)
    }
  }, [search])

  // TODO: it would be good to have the ability to go back after selected a search type action

  return (
    <StyledSearch>
      {activeItem.item?.type === ActionType.SEARCH && <QuerySearch>{activeItem.item.title} | </QuerySearch>}
      <StyledInput
        autoFocus
        autoComplete="off"
        spellCheck="false"
        value={search.value}
        placeholder="Type a command or search"
        onChange={(event) => {
          // TODO: set search type based on first few characters
          setSearch({ value: event.target.value, type: CategoryType.search })
        }}
      />

      <CenterIcon>
        <WDLogo />
      </CenterIcon>
    </StyledSearch>
  )
}

export default Search
