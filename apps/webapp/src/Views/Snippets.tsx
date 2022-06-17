import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import deleteBin6Line from '@iconify-icons/ri/delete-bin-6-line'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import genereateName from 'project-name-generator'

import SearchView, { RenderItemProps, RenderPreviewProps } from './SearchView'
import PreviewEditor from '../Components/Editor/PreviewEditor'
import { useSnippets } from '../Hooks/useSnippets'
import { Button, IconButton } from '@mexit/shared'

import { MainHeader } from '@mexit/shared'
import {
  Result,
  ResultDesc,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper,
  View
} from '@mexit/shared'
import { CreateSnippet, SnippetCommand, SnippetCommandPrefix, SnippetHeader } from '@mexit/shared'
import { Title } from '@mexit/shared'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useSearch } from '../Hooks/useSearch'
import { generateSnippetId, GenericSearchResult, mog, parseBlock, Snippet } from '@mexit/core'
import { useApi } from '../Hooks/useApi'
import { useSnippetStore } from '../Stores/useSnippetStore'

export type SnippetsProps = {
  title?: string
}

const Snippets = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const { addSnippet, deleteSnippet, getSnippet, updateSnippet, getSnippets } = useSnippets()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { queryIndex } = useSearch()
  //   const { getNode } = useNodes()
  const { goTo } = useRouting()
  const api = useApi()
  const initialSnippets: any[] = snippets.map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    text: parseBlock(snippet.content || [{ text: '' }])
  }))

  const onSearch = async (newSearchTerm: string): Promise<GenericSearchResult[]> => {
    const res = await queryIndex(['template', 'snippet'], newSearchTerm)

    if (newSearchTerm === '' && res.length === 0) {
      return initialSnippets
    }

    mog('Got search results: ', { res })
    return res
  }

  const onCreateNew = () => {
    // Create a better way.
    const snippetId = generateSnippetId()
    addSnippet({
      id: snippetId,
      title: genereateName().dashed,
      icon: 'ri:quill-pen-line',
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId)
  }

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id)
  }

  const onDeleteSnippet = (id: string) => {
    deleteSnippet(id)
  }

  // console.log({ result })
  const onSelect = (item: any) => {
    const snippetid = item.id
    onOpenSnippet(snippetid)
  }

  const onEscapeExit = () => {
    // const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
    // loadNode(nodeid)
    goTo(ROUTE_PATHS.snippets, NavigationType.push)
  }

  useEffect(() => {
    const snippets = getSnippets()

    snippets.forEach(async (item) => {
      await api.getSnippetById(item.id).then((response) => {
        updateSnippet(response as Snippet)
      })
    })
  }, [])

  // Forwarding ref to focus on the selected result
  const BaseItem = ({ item, splitOptions, ...props }: RenderItemProps<any>, ref: React.Ref<HTMLDivElement>) => {
    const snip = getSnippet(item.id)
    if (!item || !snip) {
      return null
    }
    const icon = quillPenLine
    const id = `${item.id}_ResultFor_SearchSnippet`

    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <SnippetHeader>
            <SnippetCommand onClick={() => onOpenSnippet(snip.id)}>
              <SnippetCommandPrefix>/snip.</SnippetCommandPrefix>
              {snip.title}
            </SnippetCommand>

            <IconButton size={20} icon={deleteBin6Line} title="delete" onClick={() => onDeleteSnippet(snip.id)} />
          </SnippetHeader>
          <SearchPreviewWrapper active={item.matchField?.includes('text')}>
            <PreviewEditor content={snip.content} editorId={`editor_${item.id}`} />
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain>
              <ResultTitle>{snip.title}</ResultTitle>
              <ResultDesc>{parseBlock(snip.content, ' ')}</ResultDesc>
            </ResultMain>
          </ResultRow>
        </Result>
      )
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
      const snip = getSnippet(item.id)
      const icon = quillPenLine

      // const edNode = { ...node, title: node.path, id: node.nodeid }
      return (
        <SplitSearchPreviewWrapper id={`splitSnippetSearchPreview_for_${item.id}`}>
          <Title>
            {snip.title}
            <Icon icon={icon} />
          </Title>
          <PreviewEditor content={snip.content} editorId={`SnippetSearchPreview_editor_${item.id}`} />
        </SplitSearchPreviewWrapper>
      )
    } else
      return (
        <SplitSearchPreviewWrapper>
          <Title></Title>
        </SplitSearchPreviewWrapper>
      )
  }

  return (
    <SearchContainer>
      <MainHeader>
        <Title>Snippets</Title>
        <Button primary large onClick={onCreateNew}>
          <Icon icon={quillPenLine} height={24} />
          Create New Snippet
        </Button>
      </MainHeader>
      <SearchView
        id="searchSnippet"
        key="searchSnippet"
        initialItems={initialSnippets}
        getItemKey={(i) => i.id}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
        RenderStartCard={RenderStartCard}
      />
    </SearchContainer>
  )
}

export default Snippets
