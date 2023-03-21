import React, { useEffect, useMemo } from 'react'

import { Infobox } from '@workduck-io/mex-components'
import { Indexes, SearchResult } from '@workduck-io/mex-search'

import { convertContentToRawText, defaultContent, DefaultMIcons, getInitialNode, NodeType, ViewType } from '@mexit/core'
import {
  EditorHeader,
  Group,
  IconDisplay,
  MainHeader,
  NodeInfo,
  Result,
  ResultCardFooter,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchHelp,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper,
  Title,
  useQuery
} from '@mexit/shared'

import Backlinks from '../Components/Editor/Backlinks'
import TagsRelated, { TagsRelatedTiny } from '../Components/Editor/TagsRelated'
import Metadata from '../Components/EditorInfobar/Metadata'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useFilters } from '../Hooks/useFilters'
import useLoad from '../Hooks/useLoad'
import { useNodes } from '../Hooks/useNodes'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useSearch } from '../Hooks/useSearch'
import { useTags } from '../Hooks/useTags'
import { useViewFilters } from '../Hooks/useViewFilters'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore } from '../Stores/useEditorStore'
import { useMetadataStore } from '../Stores/useMetadataStore'
import { useRecentsStore } from '../Stores/useRecentsStore'

import SearchFilters from './SearchFilters'
import SearchView, { RenderFilterProps, RenderItemProps, RenderPreviewProps } from './SearchView'

const Search = () => {
  const { loadNode } = useLoad()
  const { queryIndexWithRanking } = useSearch()
  const { getFilters } = useViewFilters()
  const { generateSearchQuery } = useQuery()

  const contents = useContentStore((store) => store.contents)
  const ilinks = useDataStore((store) => store.ilinks)
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
  const { hasTags } = useTags()
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
    const res = await queryIndexWithRanking(Indexes.MAIN, query)

    const filRes = res.filter((r) => {
      const nodeType = getNodeType(r.parent)
      return nodeType !== NodeType.MISSING && nodeType !== NodeType.ARCHIVED
    })

    return filRes
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

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>, item: SearchResult) => {
    e.preventDefault()
    const nodeid = item.parent
    if (e.detail === 2) {
      loadNode(nodeid, { highlightBlockId: item.id })
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    }
  }

  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<Partial<SearchResult>>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const node = getNode(item.parent, true)
    const nodeType = getNodeType(node.nodeid)
    if (!item || !node) {
      // eslint-disable-next-line
      // @ts-ignore
      return <Result {...props} ref={ref}></Result>
    }
    const con = contents[item.parent]
    const content = con ? con.content : defaultContent.content
    const storedNoteIcon = useMetadataStore((s) => s.metadata.notes[item.parent]?.icon)
    const icon = storedNoteIcon ?? (nodeType === NodeType.SHARED ? DefaultMIcons.SHARED_NOTE : DefaultMIcons.NOTE)
    const edNode = node ? { ...node, title: node.path, id: node.nodeid } : getInitialNode()
    const isTagged = hasTags(edNode.nodeid)
    const id = `${item.id}_ResultFor_Search`
    if (props.view === ViewType.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultHeader active>
            <IconDisplay icon={icon} />
            <ResultTitle>{node.path}</ResultTitle>
          </ResultHeader>
          <SearchPreviewWrapper>
            <EditorPreviewRenderer content={content} editorId={`editor_${item.parent}`} />
          </SearchPreviewWrapper>
          {isTagged && (
            <ResultCardFooter>
              <TagsRelatedTiny nodeid={edNode.nodeid} />
            </ResultCardFooter>
          )}
        </Result>
      )
    } else if (props.view === ViewType.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow selected={props.selected}>
            <IconDisplay icon={icon} />
            <ResultMain>
              <ResultTitle>{node.path}</ResultTitle>
              <ResultDesc>{item.text ?? convertContentToRawText(content, ' ')}</ResultDesc>
            </ResultMain>
          </ResultRow>
        </Result>
      )
    }
  }
  const RenderItem = React.forwardRef(BaseItem)

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

  const RenderPreview = ({ item }: RenderPreviewProps<SearchResult>) => {
    if (item) {
      const con = contents[item.parent]
      const content = con ? con.content : defaultContent.content
      const node = getNode(item.parent, true)
      const icon = useMetadataStore.getState().metadata.notes[item.id]?.icon

      const edNode = { ...node, title: node.path, id: node.nodeid }
      return (
        <SplitSearchPreviewWrapper id={`splitSearchPreview_for_${item.parent}`}>
          <EditorHeader>
            <NodeInfo>
              <Group>
                <IconDisplay icon={icon} size={24} />
                <Title onMouseUp={(e) => onDoubleClick(e, item)}>{node.path}</Title>
              </Group>
            </NodeInfo>
            <Metadata namespaceId={node.namespace} fadeOnHover={false} nodeId={edNode.nodeid} />
          </EditorHeader>
          <EditorPreviewRenderer
            content={content}
            blockId={item.id}
            onDoubleClick={(e) => onDoubleClick(e, item)}
            editorId={`SearchPreview_editor_${item.parent}`}
          />
          <Backlinks nodeid={node.nodeid} />
          <TagsRelated nodeid={node.nodeid} />
        </SplitSearchPreviewWrapper>
      )
    } else
      return (
        <SplitSearchPreviewWrapper>
          <Title></Title>
          <EditorPreviewRenderer content={defaultContent.content} editorId={`SearchPreview_editor_EMPTY`} />
        </SplitSearchPreviewWrapper>
      )
  }

  return (
    <SearchContainer>
      <MainHeader>
        <Title>Search</Title>
        <Infobox text={SearchHelp} />
      </MainHeader>
      <SearchView
        id="searchStandard"
        key="searchStandard"
        initialItems={initialResults}
        getItemKey={(i) => i.parent}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        RenderFilters={RenderFilters}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
        filterActions={{
          filters,
          currentFilters,
          resetCurrentFilters,
          globalJoin
        }}
      />
    </SearchContainer>
  )
}

export default Search
