import React, { useEffect } from 'react'

import { GenericSearchResult, mog } from '@mexit/core'
import { MainHeader, Result, SearchContainer, Title, View } from '@mexit/shared'

import LinkComponent from '../Components/Link'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useURLFilters, useURLsAPI } from '../Hooks/useURLs'
import { fuzzySearch } from '../Utils/fuzzysearch'
import { Link, useLinkStore } from '../Stores/useLinkStore'
import SearchFilters from './SearchFilters'
import SearchView, { RenderFilterProps, RenderItemProps } from './SearchView'

export type SnippetsProps = {
  title?: string
}

const fuzzySearchLinks = (searchTerm: string, links: Link[]): Link[] => {
  const getKeys = (link: Link) => {
    const keys = [link.title, link.url]
    if (link.shortend) {
      keys.push(link.shortend)
    }
    return keys
  }
  const newItems = fuzzySearch(links, searchTerm, getKeys)
  // mog('newItems', { newItems })
  return newItems
}

const LinkView = () => {
  const links = useLinkStore((store) => store.links)
  const { getAllLinks, saveLink } = useURLsAPI()
  //   const { getNode } = useNodes()
  const { goTo } = useRouting()

  useEffect(() => {
    getAllLinks()
    saveLink({
      title: 'test',
      url: 'https://www.google.com',
      tags: ['test', 'test2', 'wonder']
    })
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

  const initialLinks = links

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
    const linkid = item.id
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
      <Result {...props} onClick={undefined} key={id} ref={ref}>
        <LinkComponent addTagFilter={addTagFilter} link={link} />
      </Result>
    )
  }

  const RenderItem = React.forwardRef(BaseItem)

  const RenderFilters = (props: RenderFilterProps<GenericSearchResult>) => {
    mog('RenderFilters', { props })
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
        <Title>Links</Title>
      </MainHeader>
      <SearchView
        id={`view_link`}
        key={`view_link`}
        initialItems={initialLinks}
        getItemKey={(i) => i.id}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        options={{ view: View.List }}
        onSearch={onSearch}
        RenderItem={RenderItem}
        filterResults={filterResults}
        filterActions={{
          filters,
          currentFilters,
          resetCurrentFilters
        }}
        // RenderPreview={RenderPreview}
        RenderFilters={RenderFilters}
        // RenderStartCard={RenderStartCard}
      />
    </SearchContainer>
  )
}

export default LinkView
