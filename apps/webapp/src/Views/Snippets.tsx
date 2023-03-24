import React, { useEffect, useMemo } from 'react'

import magicLine from '@iconify/icons-ri/magic-line'
import { Icon } from '@iconify/react'
import deleteBin6Line from '@iconify-icons/ri/delete-bin-6-line'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { nanoid } from 'nanoid'
import generateName from 'project-name-generator'

import { Button, IconButton, Infobox, PrimaryButton } from '@workduck-io/mex-components'
import { Indexes, SearchResult } from '@workduck-io/mex-search'

import {
  batchArray,
  capitalize,
  convertContentToRawText,
  DRAFT_NODE,
  generateSnippetId,
  mog,
  SNIPPET_PREFIX,
  useDescriptionStore,
  usePromptStore,
  useSnippetStore,
  ViewType
} from '@mexit/core'
import {
  DefaultMIcons,
  Group,
  IconDisplay,
  ItemTag,
  MainHeader,
  PreviewDescription,
  Result,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchPreviewWrapper,
  SnippetHelp,
  SnippetsSearchContainer,
  SplitSearchPreviewWrapper,
  Title,
  useQuery
} from '@mexit/shared'

import Plateless from '../Components/Editor/Plateless'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useApi } from '../Hooks/API/useNodeAPI'
import usePrompts from '../Hooks/usePrompts'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useSearch } from '../Hooks/useSearch'
import { useSnippets } from '../Hooks/useSnippets'
import { WorkerRequestType } from '../Utils/worker'
import { runBatchWorker } from '../Workers/controller'

import SearchView, { RenderItemProps, RenderPreviewProps } from './SearchView'

export type SnippetsProps = {
  title?: string
}

const Snippets = () => {
  const snippets = useSnippetStore((store) => Object.values(store.snippets ?? {}))
  const { addSnippet, deleteSnippet, getSnippet, getSnippets, updateSnippet } = useSnippets()

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const getPrompt = usePromptStore((s) => s.getPrompt)
  const { queryIndexWithRanking } = useSearch()
  const { generateSearchQuery } = useQuery()
  const { goTo } = useRouting()
  const { deleteAllVersionOfSnippet } = useApi()
  const { allPrompts } = usePrompts()

  const initialItems: Partial<SearchResult>[] = useMemo(
    () => [
      ...Object.values(snippets).map((snippet) => ({
        parent: snippet.id,
        text: convertContentToRawText(snippet.content)
      })),
      ...allPrompts.map((prompt) => ({
        parent: prompt.entityId,
        text: prompt.description
      }))
    ],
    [snippets, allPrompts]
  )

  const randId = useMemo(() => nanoid(), [])

  const onSearch = async (newSearchTerm: string): Promise<Partial<SearchResult>[]> => {
    const query = generateSearchQuery(newSearchTerm)
    const res = await queryIndexWithRanking(Indexes.SNIPPET, query)

    mog('SEARCH', { query, res })

    if (!newSearchTerm && res?.length === 0) {
      return initialItems
    }

    return res
  }

  const onCreateNew = (generateTitle = false) => {
    // Create a better way.
    const snippetId = generateSnippetId()
    const snippetName = generateTitle ? generateName().dashed : DRAFT_NODE

    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: DefaultMIcons.SNIPPET,
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const onCreateSpecialSnippet = (generateTitle = false) => {
    const snippetId = generateSnippetId()
    const snippetName = generateTitle ? generateName().dashed : DRAFT_NODE

    addSnippet({
      id: snippetId,
      title: snippetName,
      template: true,
      icon: DefaultMIcons.TEMPLATE,
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)

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
    })
  }

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
    const snippet = snippets[id]
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title: snippet?.title })
  }

  const handleOpenPrompt = (id: string) => {
    goTo(ROUTE_PATHS.prompt, NavigationType.push, id)
  }

  // console.log({ result })
  const onSelect = (item: Partial<SearchResult>, e?: React.MouseEvent) => {
    if (e) {
      return
    }
    mog('SELECTED ITEM', { item })
    const isSnippet = item.parent?.startsWith(SNIPPET_PREFIX)
    handleClick(item.parent, isSnippet)
  }

  const handleClick = (id: string, isSnippet = true) => {
    if (isSnippet) onOpenSnippet(id)
    else handleOpenPrompt(id)
  }

  const onEscapeExit = () => {
    goTo(ROUTE_PATHS.snippets, NavigationType.push)
  }

  // Forwarding ref to focus on the selected result
  const BaseItem = ({ item, splitOptions, ...props }: RenderItemProps<any>, ref: React.Ref<HTMLDivElement>) => {
    const descriptions = useDescriptionStore((store) => store.descriptions)
    const isSnippet = item.parent?.startsWith(SNIPPET_PREFIX)

    const snippet = getSnippet(item.parent)
    const prompt = getPrompt(item.parent)
    const title = isSnippet ? snippet?.title : prompt?.title

    const icon = isSnippet ? (snippet?.template ? DefaultMIcons.TEMPLATE : DefaultMIcons.SNIPPET) : DefaultMIcons.PROMPT
    const id = `${item.parent}_ResultFor_SearchSnippet_${randId}`

    if (isSnippet && !snippet) return null

    if (props.view === ViewType.Card) {
      return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Result {...props} key={id} ref={ref} onClick={() => handleClick(item.parent, isSnippet)}>
          <ResultHeader $paddingSize="small">
            <Group>
              <IconDisplay icon={icon} size={20} />
              <ResultTitle>{title}</ResultTitle>
            </Group>

            {isSnippet && (
              <IconButton
                size={16}
                icon={deleteBin6Line}
                title="delete"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (isSnippet) onDeleteSnippet(item.parent)
                }}
              />
            )}
          </ResultHeader>
          <SearchPreviewWrapper padding>
            {isSnippet ? (
              <Plateless content={descriptions?.[item.parent]?.truncatedContent} multiline />
            ) : (
              <PreviewDescription>{capitalize(item.text)}</PreviewDescription>
            )}
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === ViewType.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow selected={props.selected}>
            <IconDisplay icon={icon} size={20} />
            <ResultMain onClick={() => onSelect({ parent: item.parent }, isSnippet)}>
              <ResultTitle>{title}</ResultTitle>
              <ResultDesc> {isSnippet ? descriptions?.[item.parent]?.rawText : capitalize(item.text)}</ResultDesc>
            </ResultMain>
            <IconButton
              size={20}
              icon={deleteBin6Line}
              title="Delete"
              disabled={!isSnippet}
              onClick={(ev) => {
                ev.stopPropagation()
                if (isSnippet) onDeleteSnippet(item.parent)
              }}
            />
          </ResultRow>
        </Result>
      )
    }

    return null
  }

  const RenderItem = React.forwardRef(BaseItem)

  const RenderPreview = ({ item }: RenderPreviewProps<SearchResult>) => {
    if (item) {
      const isSnippet = item.parent?.startsWith(SNIPPET_PREFIX)

      const snip = getSnippet(item.parent)
      const prompt = getPrompt(item.parent)
      const icon = isSnippet ? (snip.template ? DefaultMIcons.TEMPLATE : DefaultMIcons.SNIPPET) : DefaultMIcons.PROMPT

      if (snip && isSnippet)
        return (
          <SplitSearchPreviewWrapper id={`splitSnippetSearchPreview_for_${item.parent}_${randId}`}>
            <Title onMouseUp={(e) => onDoubleClick(e, item.parent, snip?.title)}>
              <IconDisplay icon={icon} size={24} />
              <span className="title">{snip.title}</span>
              {snip?.template && (
                <ItemTag large>
                  <Icon icon={magicLine} />
                  Template
                </ItemTag>
              )}
            </Title>
            <EditorPreviewRenderer
              readOnly
              onDoubleClick={(e) => onDoubleClick(e, item.parent, snip.title)}
              content={snip.content}
              editorId={`${item.parent}_Snippet_Preview_Editor`}
            />
          </SplitSearchPreviewWrapper>
        )

      if (!isSnippet && prompt) {
        return (
          <SplitSearchPreviewWrapper id={`splitSnippetSearchPreview_for_${item.id}_${randId}`}>
            <Title onMouseUp={(e) => onDoubleClick(e, item.parent, snip.title)}>
              <IconDisplay icon={icon} size={24} />
              <span className="title">{snip.title}</span>
            </Title>
          </SplitSearchPreviewWrapper>
        )
      }
    }
    return null
  }

  useEffect(() => {
    async function getInitialSnippets() {
      // language
      const snippets = getSnippets()
      const unfetchedSnippets = Object.values(snippets).filter((snippet) => snippet?.content?.length === 0)
      const ids = batchArray(unfetchedSnippets, 10)

      if (ids && ids.length > 0) {
        const res = await runBatchWorker(WorkerRequestType.GET_SNIPPETS, 6, ids)
        const requestData = { time: Date.now(), method: 'GET' }

        res.fulfilled.forEach((snippets) => {
          if (snippets) {
            snippets.forEach((snippet) => {
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
        <PrimaryButton onClick={() => onCreateNew()}>
          <Icon icon={quillPenLine} height={24} />
          New Snippet
        </PrimaryButton>
        <Button onClick={() => onCreateSpecialSnippet()}>
          <Icon icon={magicLine} height={24} />
          New Template
        </Button>
        <Infobox text={SnippetHelp} />
      </MainHeader>
      <SearchView
        id={`searchSnippet_${randId}`}
        initialItems={initialItems}
        getItemKey={(i) => i.parent}
        onSelect={onSelect}
        onDelete={(i) => onDeleteSnippet(i.parent)}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        options={{ view: ViewType.Card }}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
      />
    </SnippetsSearchContainer>
  )
}

export default Snippets
