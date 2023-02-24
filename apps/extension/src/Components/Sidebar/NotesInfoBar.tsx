import React, { useEffect, useRef, useState } from 'react'

import searchLine from '@iconify/icons-ri/search-line'
import { debounce } from 'lodash'
import { useTheme } from 'styled-components'

import { BASE_TASKS_PATH, fuzzySearch, ILink, isParent, mog } from '@mexit/core'
import {
  CenteredColumn,
  Input,
  List,
  MexIcon,
  SidebarListFilter,
  SidebarListFilterWrapper,
  SnippetCards
} from '@mexit/shared'

import { useLinks } from '../../Hooks/useLinks'
import useDataStore from '../../Stores/useDataStore'
import { useRecentsStore } from '../../Stores/useRecentsStore'
import { wSearchIndex } from '../../Sync/invokeOnWorker'

import { NodeCard } from './NodeCard'

export const NotesInfoBar = () => {
  const [search, setSearch] = useState<string>('')
  const [searchedNodes, setSearchedNodes] = useState<string[]>()
  const recentNotes = useRecentsStore((s) => s.lastOpened)

  const theme = useTheme()
  const { getILinkFromNodeid } = useLinks()

  const inputRef = useRef<HTMLInputElement>(null)

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const onSearch = async (newSearchTerm: string) => {
    try {
      const res = await wSearchIndex(['node'], newSearchTerm)
      if (!res) {
        const ilinks = useDataStore.getState().ilinks
        const res = fuzzySearch<ILink>(ilinks, newSearchTerm, (ilink) => ilink.path)
        const results = res?.map((item) => item.nodeid)
        setSearchedNodes(results)
      } else {
        const results = res?.map((item) => item.id) ?? []
        setSearchedNodes(results)
      }
    } catch (err) {
      mog('[NOTE SEARCH]: Unable to search', { err })
    }
  }

  const getRecentList = (noteIds: Array<string>, limit = 5) => {
    const recentList = []

    noteIds?.forEach((noteId) => {
      const noteLink = getILinkFromNodeid(noteId, true)

      if (noteLink && !isParent(noteLink.path, BASE_TASKS_PATH)) {
        recentList.push(noteId)
      }
    })

    if (recentList.length > limit) {
      return recentList.reverse().slice(0, limit)
    }

    return recentList?.reverse()
  }

  useEffect(() => {
    if (search !== '') {
      onSearch(search)
    } else {
      const defaultList = getRecentList(recentNotes)
      setSearchedNodes(defaultList)
    }
  }, [search, recentNotes])

  return (
    <SnippetCards>
      <SidebarListFilterWrapper>
        <SidebarListFilter noMargin>
          <MexIcon $noHover height={20} width={20} icon={searchLine} margin="0.6rem 0" />
          <Input
            autoFocus
            fontSize="1rem"
            placeholder={'Search notes'}
            onChange={debounce((e) => onSearchChange(e), 250)}
            ref={inputRef}
          />
        </SidebarListFilter>
        {/* <Infobox text={NotesInfoBarHelp} root={getElementById('ext-side-nav')} /> */}
      </SidebarListFilterWrapper>
      {!searchedNodes?.length ? (
        <CenteredColumn>
          <MexIcon
            color={theme.tokens.colors.primary.default}
            $noHover
            width="32"
            height="32"
            icon="gg:file-document"
          />
          <p>{!search ? 'All your recents will shown here!' : 'No Results Found!'}</p>
        </CenteredColumn>
      ) : (
        <List scrollable>
          {searchedNodes?.map((nodeId) => (
            <NodeCard key={nodeId} nodeId={nodeId} />
          ))}
        </List>
      )}
    </SnippetCards>
  )
}
