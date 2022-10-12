import React, { useEffect, useMemo } from 'react'

import { nanoid } from 'nanoid'

import { fuzzySearchLinks, GenericSearchResult, Link, mog, sortByCreated } from '@mexit/core'
import { MainHeader, Result, SearchContainer, Title, View } from '@mexit/shared'

import LinkComponent from '../Components/Link'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useURLFilters, useURLsAPI } from '../Hooks/useURLs'
import { useLinkStore } from '../Stores/useLinkStore'
import SearchFilters from './SearchFilters'
import SearchView, { RenderFilterProps, RenderItemProps } from './SearchView'

export type SnippetsProps = {
  title?: string
}

const LinkView = () => {
  const links = useLinkStore((store) => store.links)
  const { getAllLinks, saveLink } = useURLsAPI()
  //   const { getNode } = useNodes()
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

  // mog('Initial links', { initialLinks, links })

  const onSearch = async (newSearchTerm: string): Promise<Link[]> => {
    const res = fuzzySearchLinks(newSearchTerm, initialLinks)
    // mog('new search is here', { newSearchTerm, res })
    if (!newSearchTerm && res?.length === 0) {
      // mog('Inside', {})
      return initialLinks
    }
    // mog('Got search results: ', { res })
    return res
  }

  const filterResults = (results: Link[]): Link[] => {
    const linksFromRes = results
      .map((r) => {
        const link = links.find((l) => l.url === r.url)
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
    const link = links.find((s) => s.url === item.url)
    if (!item || !link) {
      return null
    }
    const id = `${item.url}_ResultFor_SearchLinks`

    return (
      <Result view={View.List} key={id} ref={ref}>
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

  // mog('Rendering LinkView', { links, initialLinks })

  return (
    <SearchContainer>
      <MainHeader>
        <Title>Links</Title>
      </MainHeader>
      <SearchView
        id={`view_link_`}
        key={`view_link_`}
        initialItems={initialLinks}
        getItemKey={(i) => i.url}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        options={{
          inputPlaceholder: 'Search links',
          view: View.List
        }}
        onSearch={onSearch}
        // place="Search links"
        RenderItem={RenderItem}
        filterResults={filterResults}
        filterActions={{
          filters,
          currentFilters,
          resetCurrentFilters,
          globalJoin
        }}
        // RenderPreview={RenderPreview}
        RenderFilters={RenderFilters}
        // RenderStartCard={RenderStartCard}
      />
    </SearchContainer>
  )
}

export default LinkView
