import React, { useEffect, useMemo } from 'react'

import { Button, IconButton, Infobox } from '@workduck-io/mex-components'

import {
  apiURLs,
  batchArray,
  convertContentToRawText,
  DRAFT_NODE,
  generateSnippetId,
  GenericSearchResult,
  mog
} from '@mexit/core'
import {
  ItemTag,
  MainHeader,
  Result,
  ResultDesc,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchPreviewWrapper,
  SnippetCommand,
  SnippetHeader,
  SnippetHelp,
  SnippetsSearchContainer,
  SplitSearchPreviewWrapper,
  Title,
  View
} from '@mexit/shared'

import Plateless from '../Components/Editor/Plateless'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useApi } from '../Hooks/API/useNodeAPI'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useSearch } from '../Hooks/useSearch'
import { useSnippets } from '../Hooks/useSnippets'
import { useUpdater } from '../Hooks/useUpdater'
import { useApiStore } from '../Stores/useApiStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import { WorkerRequestType } from '../Utils/worker'
import { runBatchWorker } from '../Workers/controller'
import SearchView, { RenderItemProps, RenderPreviewProps } from './SearchView'
import magicLine from '@iconify/icons-ri/magic-line'
import { Icon } from '@iconify/react'
import deleteBin6Line from '@iconify-icons/ri/delete-bin-6-line'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { nanoid } from 'nanoid'
import genereateName from 'project-name-generator'

export type SnippetsProps = {
  title?: string
}

const Snippets = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const { addSnippet, deleteSnippet, getSnippet, getSnippets, updateSnippet } = useSnippets()
  const { updater } = useUpdater()

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { queryIndex } = useSearch()
  const { goTo } = useRouting()
  const { deleteAllVersionOfSnippet } = useApi()

  const setRequest = useApiStore.getState().setRequest

  const { initialSnippets }: { initialSnippets: GenericSearchResult[] } = useMemo(
    () => ({
      initialSnippets: snippets.map((snippet) => ({
        id: snippet.id,
        title: snippet.title,
        text: convertContentToRawText(snippet.content)
      }))
    }),
    [snippets]
  )

  const randId = useMemo(() => nanoid(), [initialSnippets])

  const onSearch = async (newSearchTerm: string): Promise<GenericSearchResult[]> => {
    const res = await queryIndex(['template', 'snippet'], newSearchTerm)

    if (!newSearchTerm && res?.length === 0) {
      return initialSnippets
    }

    return res
  }

  const onCreateNew = (generateTitle = false) => {
    // Create a better way.
    const snippetId = generateSnippetId()
    const snippetName = generateTitle ? genereateName().dashed : DRAFT_NODE
    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: 'ri:quill-pen-line',
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)
    updater()

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const onCreateSpecialSnippet = (generateTitle = false) => {
    const snippetId = generateSnippetId()
    const snippetName = generateTitle ? genereateName().dashed : DRAFT_NODE

    addSnippet({
      id: snippetId,
      title: snippetName,
      template: true,
      icon: 'ri:quill-pen-line',
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)
    updater()

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>, id: string, title: string) => {
    e.preventDefault()
    if (e.detail === 2) {
      onOpenSnippet(id)
      goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title })
    }
  }
  const onDeleteSnippet = (id: string) => {
    deleteAllVersionOfSnippet(id).then(() => {
      deleteSnippet(id)
      goTo(ROUTE_PATHS.snippets, NavigationType.replace)
    })
  }

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
    const snippet = snippets.find((snippet) => snippet.id === id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title: snippet?.title })
  }

  // console.log({ result })
  const onSelect = (item: GenericSearchResult, e?: React.MouseEvent) => {
    if (e) {
      return
    }
    const snippetId = item.id
    const snippetName = item.title
    onOpenSnippet(snippetId)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const onEscapeExit = () => {
    goTo(ROUTE_PATHS.snippets, NavigationType.push)
  }

  // Forwarding ref to focus on the selected result
  const BaseItem = ({ item, splitOptions, ...props }: RenderItemProps<any>, ref: React.Ref<HTMLDivElement>) => {
    const descriptions = useDescriptionStore((store) => store.descriptions)
    const snip = getSnippet(item.id)

    if (!snip) {
      return null
    }
    const icon = quillPenLine
    const id = `${item.id}_ResultFor_SearchSnippet_${randId}`

    // mog('item', { item, descriptions })

    if (props.view === View.Card) {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Result {...props} key={id} ref={ref} onClick={() => onOpenSnippet(snip.id)}>
          <SnippetHeader>
            <SnippetCommand>
              <Icon icon={icon} />
              {snip.title}
            </SnippetCommand>

            <IconButton
              size={20}
              icon={deleteBin6Line}
              title="delete"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDeleteSnippet(snip.id)
              }}
            />
          </SnippetHeader>
          <SearchPreviewWrapper active={item.matchField?.includes('text')} padding>
            {/* descriptions?.[snip.id]?.rawText */}
            <Plateless content={descriptions?.[snip.id]?.truncatedContent} multiline />
            {/* <PreviewEditor content={snip.content} editorId={`editor_${item.id}`} /> */}
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain onClick={() => onSelect({ id: snip.id, title: snip.title })}>
              <ResultTitle>{snip.title}</ResultTitle>
              <ResultDesc> {descriptions?.[snip.id]?.rawText}</ResultDesc>
            </ResultMain>
            <IconButton
              size={20}
              icon={deleteBin6Line}
              title="Delete"
              onClick={(ev) => {
                ev.stopPropagation()
                onDeleteSnippet(snip.id)
              }}
            />
          </ResultRow>
        </Result>
      )
    }

    return null
  }

  const RenderItem = React.forwardRef(BaseItem)

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    // mog('RenderPreview', { item })
    if (item) {
      const icon = quillPenLine
      const snip = getSnippet(item.id)

      // const edNode = { ...node, title: node.path, id: node.nodeid }
      if (snip)
        return (
          <SplitSearchPreviewWrapper id={`splitSnippetSearchPreview_for_${item.id}_${randId}`}>
            <Title onMouseUp={(e) => onDoubleClick(e, item.id, item.title)}>
              <span className="title">{snip.title}</span>
              {snip.template && (
                <ItemTag large>
                  <Icon icon={magicLine} />
                  Template
                </ItemTag>
              )}
              <Icon icon={icon} />
            </Title>
            <EditorPreviewRenderer
              readOnly
              onDoubleClick={(e) => onDoubleClick(e, item.id, item.title)}
              content={snip.content}
              editorId={`${item.id}_Snippet_Preview_Editor`}
            />
          </SplitSearchPreviewWrapper>
        )
    }
    return null
  }

  useEffect(() => {
    async function getInitialSnippets() {
      // language
      const snippets = getSnippets()
      const unfetchedSnippets = snippets.filter((snippet) => snippet.content.length === 0)
      const ids = batchArray(unfetchedSnippets, 10)

      mog('SnippetsUseEffect', { snippets, unfetchedSnippets })

      if (ids && ids.length > 0) {
        const res = await runBatchWorker(WorkerRequestType.GET_SNIPPETS, 6, ids)
        const requestData = { time: Date.now(), method: 'GET' }

        res.fulfilled.forEach((snippets) => {
          if (snippets) {
            snippets.forEach((snippet) => {
              setRequest(apiURLs.snippet.getById(snippet.id), {
                ...requestData,
                url: apiURLs.snippet.getById(snippet.id)
              })
              updateSnippet(snippet)
            })
          }
        })

        mog('RunBatchWorkerSnippetsRes', { res, ids })
      }
    }
    getInitialSnippets()
  }, [])

  return (
    <SnippetsSearchContainer>
      <MainHeader>
        <Title>Snippets</Title>
        <Button primary onClick={() => onCreateNew()}>
          <Icon icon={quillPenLine} height={24} />
          Create New Snippet
        </Button>
        <Button primary onClick={() => onCreateSpecialSnippet()}>
          <Icon icon={magicLine} height={24} />
          Create New Template Snippet
        </Button>
        <Infobox text={SnippetHelp} />
      </MainHeader>
      <SearchView
        id={`searchSnippet_${randId}`}
        initialItems={initialSnippets}
        getItemKey={(i) => i.id}
        onSelect={onSelect}
        onDelete={(i) => onDeleteSnippet(i.id)}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        options={{ view: View.Card }}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
      />
    </SnippetsSearchContainer>
  )
}

export default Snippets
