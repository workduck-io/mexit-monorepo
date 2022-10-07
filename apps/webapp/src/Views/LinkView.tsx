import React, { useMemo } from 'react'

import deleteBin6Line from '@iconify-icons/ri/delete-bin-6-line'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'

import { IconButton } from '@workduck-io/mex-components'

import { generateTempId, GenericSearchResult, mog } from '@mexit/core'
import {
  CreateSnippet,
  MainHeader,
  Result,
  ResultDesc,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SplitSearchPreviewWrapper,
  Title,
  View
} from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useURLFilters } from '../Hooks/useURLs'
import { Link, useLinkStore } from '../Stores/useLinkStore'
import SearchFilters from './SearchFilters'
import SearchView, { RenderFilterProps, RenderItemProps, RenderPreviewProps } from './SearchView'
import LinkComponent from '../Components/Link'

export type SnippetsProps = {
  title?: string
}

const LinkView = () => {
  const links = useLinkStore((store) => store.links)
  //   const { getNode } = useNodes()
  const { goTo } = useRouting()

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

  mog('Initial links', { initialLinks, links })

  const onSearch = async (newSearchTerm: string): Promise<Link[]> => {
    const res = initialLinks

    mog('new search is here', { newSearchTerm, res })
    if (!newSearchTerm && res?.length === 0) {
      mog('Inside', {})
      return initialLinks
    }

    mog('Got search results: ', { res })
    return res
  }

  const filterResults = (results: Link[]): Link[] => {
    const linksFromRes = results
      .map((r) => {
        const link = links.find((l) => l.id === r.id)
        return link
      })
      .filter((l) => l)
    const nFilters = generateLinkFilters(linksFromRes)
    setFilters(nFilters)
    const filtered = applyCurrentFilters(results)
    mog('filtered', { filtered, nFilters, currentFilters, results })
    return filtered
  }
  // What Create new????
  const onCreateNew = () => {
    // Create a better way.
    // const snippetId = generateSnippetId()
    // addSnippet({
    //   id: snippetId,
    //   title: genereateName().dashed,
    //   icon: 'ri:quill-pen-line',
    //   content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    // })
    // loadSnippet(snippetId)
    // goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId)
  }

  const onOpenLink = (id: string) => {
    mog('Opening link', { id })
  }

  const onDeleteLink = (id: string) => {
    mog('Deleting link', { id })
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
    const link = links.find((s) => s.id === item.id)
    if (!item || !link) {
      return null
    }
    const icon = quillPenLine
    const id = `${item.id}_ResultFor_SearchSnippet`

    if (props.view === View.Card) {
      return <Result key={id} ref={ref}></Result>
    } else if (props.view === View.List) {
      return (
        <Result {...props} onClick={undefined} key={id} ref={ref}>
          <LinkComponent addTagFilter={addTagFilter} link={link} />
        </Result>
      )
      // <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
      //   <Icon icon={icon} />
      //   <ResultMain>
      //     <ResultTitle>{link.title}</ResultTitle>
      //     <ResultDesc>Description and stuff</ResultDesc>
      //   </ResultMain>
      //   <IconButton
      //     size={20}
      //     icon={deleteBin6Line}
      //     title="delete"
      //     onClick={(ev) => {
      //       ev.stopPropagation()
      //       onDeleteLink(link.id)
      //     }}
      //   />
      // </ResultRow>
    }

    return null
  }
  const RenderItem = React.forwardRef(BaseItem)

  const RenderStartCard = () => {
    // mog('RenderPreview', { item })
    return (
      <CreateSnippet onClick={onCreateNew}>
        <Icon icon={quillPenLine} height={100} />
        <p>Create New Snippet</p>
      </CreateSnippet>
    )
  }

  const RenderPreview = ({ item }: RenderPreviewProps<any>) => {
    // mog('RenderPreview', { item })
    if (item) {
      const link = links.find((s) => s.id === item.id)
      const icon = quillPenLine

      // const edNode = { ...node, title: node.path, id: node.nodeid }
      return (
        <SplitSearchPreviewWrapper id={`splitSnippetSearchPreview_for_${item.id}`}>
          <Title>
            {link.title}
            <Icon icon={icon} />
          </Title>
        </SplitSearchPreviewWrapper>
      )
    } else
      return (
        <SplitSearchPreviewWrapper>
          <Title></Title>
        </SplitSearchPreviewWrapper>
      )
  }

  // const randId = useMemo(() => generateTempId(), [initialLinks])

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

  // <Button primary large onClick={onCreateNew}>
  //   <Icon icon={quillPenLine} height={24} />
  //   Create New Snippet
  // </Button>

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
