import React, { useEffect, useMemo } from 'react'

import { Indexes, SearchResult } from '@workduck-io/mex-search'

import { NodeType, useContentStore, useDataStore, useEditorStore, useRecentsStore } from '@mexit/core'
import { HomepageSearchContainer, useNodes, useQuery } from '@mexit/shared'

import { useFilters } from '../../Hooks/useFilters'
import useLoad from '../../Hooks/useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useSearch } from '../../Hooks/useSearch'
import { useViewFilters } from '../../Hooks/useViewFilters'
import SearchFilters from '../../Views/SearchFilters'
import { RenderFilterProps } from '../../Views/SearchView'

import HomepageSearchView from './HomepageSearchView'

const HomepageSearchbar = ({ showFilters, setShowFilters, setShowrecents, isHomepage, searchState, setSS }) => {
  const { loadNode } = useLoad()
  const { queryIndexWithRanking } = useSearch()
  const { getFilters } = useViewFilters()
  const { generateSearchQuery } = useQuery()
  const ilinks = useDataStore((store) => store.ilinks)

  const contents = useContentStore((store) => store.contents)
  const initialResults = useMemo(
    () =>
      ilinks
        .map(
          (link): Partial<SearchResult> => ({
            parent: link.nodeid
          })
        )
        .slice(0, 12),
    [ilinks]
  )

  const { getNode, getNodeType } = useNodes()
  const { goTo } = useRouting()
  const {
    addCurrentFilter,
    removeCurrentFilter,
    filters,
    changeCurrentFilter,
    globalJoin,
    setFilters,
    currentFilters,
    resetCurrentFilters
  } = useFilters<SearchResult>()

  useEffect(() => {
    setFilters(getFilters())
  }, [])

  const onSearch = async (newSearchTerm: string) => {
    const query = generateSearchQuery(newSearchTerm, currentFilters)
    const noteResult = await queryIndexWithRanking(Indexes.MAIN, query)
    const snippetResult = await queryIndexWithRanking(Indexes.SNIPPET, query)

    const filRes = noteResult.filter((r) => {
      const nodeType = getNodeType(r.parent)
      return nodeType !== NodeType.MISSING && nodeType !== NodeType.ARCHIVED
    })

    return [...filRes, ...snippetResult]
  }

  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const nodeUID = useEditorStore((store) => store.node.nodeid)
  const baseNodeId = useDataStore((store) => store.baseNodeId)

  const onSelect = (item: SearchResult) => {
    const nodeid = item.parent
    loadNode(nodeid, { highlightBlockId: item.id })
    goTo(ROUTE_PATHS.editor, NavigationType.push, nodeid)
  }

  const onEscapeExit = () => {
    const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
    loadNode(nodeid)
    goTo(ROUTE_PATHS.editor, NavigationType.push, nodeid)
  }

  const RenderFilters = (props: RenderFilterProps<SearchResult>) => {
    return (
      <SearchFilters
        {...props}
        addCurrentFilter={addCurrentFilter}
        removeCurrentFilter={removeCurrentFilter}
        resetCurrentFilters={resetCurrentFilters}
        changeCurrentFilter={changeCurrentFilter}
        filters={filters}
        currentFilters={currentFilters}
      />
    )
  }

  return (
    <HomepageSearchContainer>
      <HomepageSearchView
        id="searchStandard"
        key="searchStandard"
        initialItems={initialResults}
        getItemKey={(i) => i.parent}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        RenderFilters={RenderFilters}
        filterActions={{
          filters,
          currentFilters,
          resetCurrentFilters,
          globalJoin
        }}
        showFilters={showFilters}
        setShowrecents={setShowrecents}
        setShowFilters={setShowFilters}
        isHomepage={isHomepage}
        searchState={searchState}
        setSS={setSS}
      />
    </HomepageSearchContainer>
  )
}

export default HomepageSearchbar
