import React, { useEffect, useRef } from 'react'

import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { Icon } from '@iconify/react'
import fuzzysort from 'fuzzysort'
import { useTheme } from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import { tinykeys } from '@workduck-io/tinykeys'

import {
  initActions,
  withoutContinuousDelimiter,
  CategoryType,
  CREATE_NEW_ITEM,
  insertItemInArray,
  BASE_TASKS_PATH,
  isParent,
  ListItemType,
  MAX_RECENT_ITEMS
} from '@mexit/core'
import { Loading, WDLogo } from '@mexit/shared'

import { useActionExecutor } from '../../Hooks/useActionExecutor'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useLinks } from '../../Hooks/useLinks'
import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useSearch } from '../../Hooks/useSearch'
import { useSearchProps } from '../../Hooks/useSearchProps'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
import useDataStore from '../../Stores/useDataStore'
// import events from "events"
import { useRecentsStore } from '../../Stores/useRecentsStore'
import { type SearchType, useSputlitStore } from '../../Stores/useSputlitStore'
import { getListItemFromNode } from '../../Utils/helper'
import { CenterIcon, StyledInput, StyledSearch } from './styled'

const Search = () => {
  const { input, setInput, selection, activeItem, setSearchResults, isLoading } = useSputlitContext()
  const { searchInList } = useSearch()
  const search = useSputlitStore((store) => store.search)
  const setSearch = useSputlitStore((store) => store.setSearch)
  const { previewMode, setPreviewMode } = useEditorContext()
  const { icon, placeholder } = useSearchProps()
  const { saveIt } = useSaveChanges()
  const { getILinkFromNodeid } = useLinks()
  const lastOpenedNodes = useRecentsStore((state) => state.lastOpened)
  const ilinks = useDataStore((state) => state.ilinks)
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>()
  const { execute } = useActionExecutor()

  const getQuery = (value: string): SearchType => {
    const query: SearchType = {
      value: value.trim(),
      type: CategoryType.search
    }

    // if (value.startsWith('[[')) {
    //   query.type = CategoryType.backlink
    // }

    // if (value.startsWith('/')) {
    //   query.type = CategoryType.action
    // }

    return query
  }

  const handleSearchInput = useDebouncedCallback((value: string) => {
    // * based on value of input, set search category type

    const query = getQuery(value)

    setSearch(query)
  }, 200)

  useEffect(() => {
    const unsubscribe = tinykeys(ref.current, {
      Enter: (ev) => {
        execute(activeItem)
      }
    })

    return () => unsubscribe()
  }, [activeItem])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const dots = new RegExp(/\.{2,}/g)
    const replaceContinousDots = value.replace(dots, '.') // * replace two or more dots with one dot

    const key = withoutContinuousDelimiter(replaceContinousDots).key

    const query = key.startsWith('.') || key.startsWith('[[.') ? key.replace('.', '') : key

    setInput(replaceContinousDots)
    handleSearchInput(query)
  }

  const getRecentList = (noteIds: Array<string>, limit = MAX_RECENT_ITEMS) => {
    const recentList: Array<ListItemType> = []

    // const extra = getSearchExtra()

    noteIds.forEach((noteId) => {
      const noteLink = getILinkFromNodeid(noteId)

      if (noteLink && !isParent(noteLink.path, BASE_TASKS_PATH)) {
        const item = getListItemFromNode(
          noteLink
          // { searchRepExtra: extra }
        )
        recentList.push(item)
      }
    })

    if (recentList.length > limit) {
      return recentList.slice(0, limit)
    }

    return recentList
  }

  // * For setting the results
  useEffect(() => {
    async function getSearchItems() {
      if (!activeItem) {
        if (search.value) {
          const listWithNew = await searchInList()
          setSearchResults(listWithNew)
        } else if (selection) {
          setSearchResults(initActions)
        } else {
          if (!previewMode) return

          const notesOpened = lastOpenedNodes

          const recents = getRecentList(notesOpened).reverse()

          const listWithNew = insertItemInArray(recents, CREATE_NEW_ITEM, 1)

          const results = [...listWithNew, ...initActions]
          setSearchResults(results)
        }
      }
    }

    if (previewMode) getSearchItems()
  }, [search.value, selection, activeItem, previewMode, ilinks])

  const onBackClick = () => {
    if (!previewMode) {
      setPreviewMode(true)
      saveIt(false, true)
    }
  }

  return (
    <StyledSearch>
      {/* {activeItem?.type === ActionType.SEARCH && <QuerySearch>{activeItem.title} | </QuerySearch>} */}
      <CenterIcon id="wd-mex-search-left-icon" cursor={!previewMode} onClick={onBackClick}>
        <Icon color={theme.colors.primary} height={24} width={24} icon={icon} />
      </CenterIcon>
      <StyledInput
        ref={ref}
        autoFocus={previewMode}
        disabled={!previewMode}
        autoComplete="off"
        spellCheck="false"
        value={input}
        placeholder={placeholder}
        onChange={onChange}
      />

      <CenterIcon>{isLoading ? <Loading color={theme.colors.primary} dots={3} transparent /> : <WDLogo />}</CenterIcon>
    </StyledSearch>
  )
}

export default Search
