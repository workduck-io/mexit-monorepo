import fuzzysort from 'fuzzysort'
import React, { useEffect, useState } from 'react'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { Icon } from '@iconify/react'
import { Loading, WDLogo } from '@mexit/shared'
import { useDebouncedCallback } from 'use-debounce'
import { Search, useSputlitContext } from '../../Hooks/useSputlitContext'
import { CenterIcon, QuerySearch, StyledInput, StyledSearch } from './styled'
import {
  initActions,
  searchBrowserAction,
  defaultActions,
  ActionType,
  withoutContinuousDelimiter,
  CategoryType
} from '@mexit/core'
import { useTheme } from 'styled-components'

const Search = () => {
  const [input, setInput] = useState('')
  const { search, setSearch, setSearchResults, activeItem, isLoading } = useSputlitContext()
  const theme = useTheme()

  const getQuery = (value: string): Search => {
    const query: Search = {
      value: value.trim(),
      type: CategoryType.search
    }

    if (value.startsWith('[[')) {
      query.type = CategoryType.backlink
    }

    if (value.startsWith('/')) {
      query.type = CategoryType.action
    }

    return query
  }

  const handleSearchInput = useDebouncedCallback((value: string) => {
    // * based on value of input, set search category type

    const query = getQuery(value)

    setSearch(query)
  }, 200)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const dots = new RegExp(/\.{2,}/g)
    const replaceContinousDots = value.replace(dots, '.') // * replace two or more dots with one dot

    const key = withoutContinuousDelimiter(replaceContinousDots).key

    const query = key.startsWith('.') || key.startsWith('[[.') ? key.replace('.', '') : key

    setInput(replaceContinousDots)
    handleSearchInput(query)
  }

  // useEffect(() => {
  //   if (search.value !== '') {
  //     const res = fuzzysort.go(search.value, initActions, { key: 'title' }).map((item) => item.obj)
  //     if (res.length === 0) setSearchResults([searchBrowserAction(search.value)])
  //     else setSearchResults(res)
  //   } else {
  //     setSearchResults(defaultActions)
  //   }
  // }, [search])

  // TODO: it would be good to have the ability to go back after selected a search type action

  return (
    <StyledSearch>
      {activeItem?.type === ActionType.SEARCH && <QuerySearch>{activeItem.title} | </QuerySearch>}
      <CenterIcon id="wd-mex-search-left-icon" cursor={false}>
        <Icon color={theme.colors.primary} height={24} width={24} icon={LensIcon} />
      </CenterIcon>
      <StyledInput
        autoFocus
        autoComplete="off"
        spellCheck="false"
        value={input}
        placeholder="[[  for Backlinks or / for actions"
        onChange={onChange}
      />

      <CenterIcon>{isLoading ? <Loading color={theme.colors.primary} dots={3} transparent /> : <WDLogo />}</CenterIcon>
    </StyledSearch>
  )
}

export default Search
