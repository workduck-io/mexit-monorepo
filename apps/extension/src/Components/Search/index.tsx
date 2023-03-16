import React, { useEffect, useRef } from 'react'

import { useTheme } from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import { tinykeys } from '@workduck-io/tinykeys'

import {
  ActionType,
  BASE_TASKS_PATH,
  CategoryType,
  CREATE_NEW_ITEM,
  CREATE_NEW_SNIPPET,
  initActions,
  insertItemInArray,
  isParent,
  ListItemType,
  MAX_RECENT_ITEMS,
  useDataStore,
  useDescriptionStore,
  useRecentsStore,
  withoutContinuousDelimiter
} from '@mexit/core'
import { IconDisplay, Loading, WDLogo } from '@mexit/shared'

import { useActionExecutor } from '../../Hooks/useActionExecutor'
import { useEditorStore } from '../../Hooks/useEditorStore'
import { useLinks } from '../../Hooks/useLinks'
import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useSearch } from '../../Hooks/useSearch'
import { useSearchProps } from '../../Hooks/useSearchProps'
import { useSputlitContext } from '../../Hooks/useSputlitContext'
// import events from "events"
import { type SearchType, useSputlitStore } from '../../Stores/useSputlitStore'
import { getListItemFromNode } from '../../Utils/helper'

import { CenterIcon, StyledInput, StyledSearch } from './styled'

const Search = () => {
  const { isLoading } = useSputlitContext()
  const selection = useSputlitStore((s) => s.selection)

  const input = useSputlitStore((s) => s.input)
  const activeItem = useSputlitStore((s) => s.activeItem)
  const setInput = useSputlitStore((s) => s.setInput)
  const setResults = useSputlitStore((s) => s.setResults)
  const { searchInList } = useSearch()
  const search = useSputlitStore((store) => store.search)
  const setSearch = useSputlitStore((store) => store.setSearch)
  const { previewMode, setPreviewMode } = useEditorStore()
  const { icon, placeholder } = useSearchProps()
  const { saveIt } = useSaveChanges()
  const { getILinkFromNodeid } = useLinks()
  const lastOpenedNodes = useRecentsStore((state) => state.lastOpened)
  const ilinks = useDataStore((state) => state.ilinks)
  const theme = useTheme()
  const ref = useRef<HTMLInputElement>()
  const { execute } = useActionExecutor()

  const getQuery = (value: string): SearchType => {
    const selection = useSputlitStore.getState().selection
    const activeItem = useSputlitStore.getState().activeItem

    const query: SearchType = {
      value: value.trim(),
      type: CategoryType.action
    }

    if (selection || activeItem?.extras?.withinMex) {
      query.type = CategoryType.backlink
    }

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
        const activeItem = useSputlitStore.getState().activeItem

        if (activeItem?.type === ActionType.SEARCH && !activeItem?.extras?.withinMex) {
          execute(activeItem)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    const dots = new RegExp(/\.{2,}/g)
    const replaceContinousDots = value.replace(dots, '.') // * replace two or more dots with one dot

    const key = withoutContinuousDelimiter(replaceContinousDots).key

    const query = key.startsWith('.') ? key.replace('.', '') : key

    setInput(replaceContinousDots)
    handleSearchInput(query)
  }

  const getRecentList = (noteIds: Array<string>, actionType?: ActionType, limit = MAX_RECENT_ITEMS) => {
    const recentList: Array<ListItemType> = []

    // const extra = getSearchExtra()

    noteIds.forEach((noteId) => {
      const noteLink = getILinkFromNodeid(noteId)

      if (noteLink && !isParent(noteLink.path, BASE_TASKS_PATH)) {
        const item = getListItemFromNode(
          noteLink,
          undefined,
          undefined,
          actionType
          // { searchRepExtra: extra }
        )
        recentList.push(item)
      }
    })

    // if (recentList.length > limit) {
    //   return recentList.reverse().slice(0, limit)
    // }

    return recentList?.reverse()
  }

  // * For setting the results
  useEffect(() => {
    async function getSearchItems() {
      const activeItem = useSputlitStore.getState().activeItem
      const isSearchWithinMex = activeItem?.extras?.withinMex
      const actionType = isSearchWithinMex ? ActionType.OPEN : undefined

      if (!activeItem || isSearchWithinMex) {
        if (!search.value && (selection || isSearchWithinMex)) {
          const notesOpened = lastOpenedNodes

          const recents = getRecentList(notesOpened, actionType)
          const listWithNew = insertItemInArray(recents, [CREATE_NEW_ITEM, CREATE_NEW_SNIPPET], 1)

          setResults(isSearchWithinMex ? recents : listWithNew)
        } else if (search.value) {
          const listWithNew = await searchInList(actionType)
          setResults(listWithNew)
        } else {
          setResults(initActions)
        }
      }
    }

    getSearchItems()
  }, [search, selection, previewMode, ilinks, useDescriptionStore, lastOpenedNodes])

  const onBackClick = () => {
    if (!previewMode) {
      setPreviewMode(true)
      saveIt(false, true)
    }
  }

  const getIsPreviewMode = () => {
    if (activeItem)
      switch (activeItem?.type) {
        case ActionType.RENDER:
        case ActionType.MAGICAL:
        case ActionType.SCREENSHOT:
        case ActionType.AVATAR_GENERATOR:
          return true
      }

    return !previewMode
  }

  const isDisabled = getIsPreviewMode()

  return (
    <StyledSearch>
      {/* {activeItem?.type === ActionType.SEARCH && <QuerySearch>{activeItem.title} | </QuerySearch>} */}
      <CenterIcon id="wd-mex-search-left-icon" $cursor={!previewMode} onClick={onBackClick}>
        <IconDisplay icon={icon} />
      </CenterIcon>
      <StyledInput
        ref={ref}
        autoFocus={previewMode}
        disabled={isDisabled}
        autoComplete="off"
        spellCheck="false"
        value={input}
        placeholder={placeholder}
        onChange={onChange}
      />

      <CenterIcon>
        {isLoading ? <Loading color={theme.tokens.colors.primary.default} dots={3} transparent /> : <WDLogo />}
      </CenterIcon>
    </StyledSearch>
  )
}

export default Search
