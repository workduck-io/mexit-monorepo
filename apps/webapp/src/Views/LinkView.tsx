import React, { useEffect, useMemo } from 'react'

import { fuzzySearchLinks, GenericSearchResult, Link, mog, sortByCreated, useLinkStore, ViewType } from '@mexit/core'
import { MainHeader, Result, SearchContainer, Title } from '@mexit/shared'

import LinkComponent from '../Components/Link'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useURLFilters, useURLsAPI } from '../Hooks/useURLs'

import SearchFilters from './SearchFilters'
import SearchView, { RenderFilterProps, RenderItemProps } from './SearchView'

export type SnippetsProps = {
  title?: string
}

const LinkView = () => {
  const links = useLinkStore((store) => store.links)
  const { getAllLinks } = useURLsAPI()
  const { goTo } = useRouting()

  /**
   * Fetch all links on render
   */
  useEffect(() => {
    getAllLinks()
  }, [])

  const {
    filters,
    currentFilters,
    changeCurrentFilter,
    globalJoin,
    setGlobalJoin,
    addCurrentFilter,
    removeCurrentFilter,
    resetCurrentFilters,
    generateLinkFilters,
    setFilters,
    applyCurrentFilters,
    addTagFilter
  } = useURLFilters()

  const initialLinks = useMemo(() => {
    return links.sort(sortByCreated)
  }, [links])

  const onSearch = async (newSearchTerm: string): Promise<Link[]> => {
    const res = fuzzySearchLinks(newSearchTerm, initialLinks)
    if (!newSearchTerm && res?.length === 0) {
      return initialLinks
    }
    return res
  }

  const filterResults = (results: Link[]): Link[] => {
    const linksFromRes = results
      .map((r) => {
        const link = links?.find((l) => l.url === r.url)
        return link
      })
      .filter((l) => l)
    const nFilters = generateLinkFilters(linksFromRes)
    setFilters(nFilters)
    const filtered = applyCurrentFilters(results)
    // mog('filtered', { filtered, nFilters, currentFilters, results })
    return filtered
  }

  const onOpenLink = (url: string) => {
    mog('Opening link', { url })
    if (url) {
      window.open(url, '_blank')
    }
  }

  // console.log({ result })
  const onSelect = (item: any) => {
    const linkid = item.url
    onOpenLink(linkid)
  }

  const onEscapeExit = () => {
    // const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
    // loadNode(nodeid)
    goTo(ROUTE_PATHS.snippets, NavigationType.push)
  }

  // Forwarding ref to focus on the selected result
  const BaseItem = ({ item, splitOptions, ...props }: RenderItemProps<any>, ref: React.Ref<HTMLDivElement>) => {
    const link = links?.find((s) => s.url === item.url)
    if (!item || !link) {
      return null
    }
    const id = `${item.url}_ResultFor_SearchLinks`

    return (
      <Result view={ViewType.List} key={id} ref={ref}>
        <LinkComponent addTagFilter={addTagFilter} link={link} />
      </Result>
    )
  }

  const RenderItem = React.forwardRef(BaseItem)

  const RenderFilters = (props: RenderFilterProps<GenericSearchResult>) => {
    return (
      <SearchFilters
        {...props}
        addCurrentFilter={addCurrentFilter}
        removeCurrentFilter={removeCurrentFilter}
        resetCurrentFilters={resetCurrentFilters}
        filters={filters}
        currentFilters={currentFilters}
        globalJoin={globalJoin}
        setGlobalJoin={setGlobalJoin}
        changeCurrentFilter={changeCurrentFilter}
      />
    )
  }

  return (
    <SearchContainer>
      <MainHeader>
        <Title>Captures</Title>
      </MainHeader>
      <SearchView
        id="mexit-captures"
        key="mexit-captures"
        initialItems={initialLinks}
        getItemKey={(i) => i.url}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        options={{
          inputPlaceholder: 'Search captures',
          view: ViewType.List
        }}
        onSearch={onSearch}
        RenderItem={RenderItem}
        filterActions={{
          filters,
          currentFilters,
          resetCurrentFilters,
          globalJoin
        }}
        RenderFilters={RenderFilters}
      />
    </SearchContainer>
  )
}

export default LinkView
