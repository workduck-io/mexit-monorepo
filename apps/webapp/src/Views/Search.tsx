import React from 'react'

import fileList2Line from '@iconify-icons/ri/file-list-2-line'
import shareLine from '@iconify/icons-ri/share-line'
import { Icon } from '@iconify/react'

import { Infobox } from '@workduck-io/mex-components'

import {
  GenericSearchResult,
  defaultContent,
  mog,
  NodeType,
  convertContentToRawText,
  getInitialNode
} from '@mexit/core'
import { MainHeader, TitleText, ResultCardFooter, Title } from '@mexit/shared'
import {
  Result,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultMetaData,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper,
  View
} from '@mexit/shared'

import Backlinks from '../Components/Editor/Backlinks'
import TagsRelated, { TagsRelatedTiny } from '../Components/Editor/TagsRelated'
import Metadata from '../Components/EditorInfobar/Metadata'
import { SearchHelp } from '../Data/defaultText'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useFilters } from '../Hooks/useFilters'
import useLoad from '../Hooks/useLoad'
import { useNodes } from '../Hooks/useNodes'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useSearch } from '../Hooks/useSearch'
import { useTags } from '../Hooks/useTags'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore } from '../Stores/useEditorStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import SearchFilters from './SearchFilters'
import SearchView, { RenderFilterProps, RenderItemProps, RenderPreviewProps } from './SearchView'
import { SplitType } from './SplitView'

const Search = () => {
  const { loadNode } = useLoad()
  const { queryIndexWithRanking } = useSearch()
  const contents = useContentStore((store) => store.contents)
  const ilinks = useDataStore((store) => store.ilinks)
  const initialResults = ilinks
    .map(
      (link): GenericSearchResult => ({
        id: link.nodeid,
        title: link.path
      })
    )
    .slice(0, 12)
  const { getNode, getNodeType } = useNodes()
  const { goTo } = useRouting()
  const { hasTags } = useTags()
  const {
    applyCurrentFilters,
    addCurrentFilter,
    setFilters,
    generateNodeSearchFilters,
    removeCurrentFilter,
    filters,
    currentFilters,
    resetCurrentFilters
  } = useFilters<GenericSearchResult>()

  const onSearch = async (newSearchTerm: string) => {
    const res = await queryIndexWithRanking(['shared', 'node'], newSearchTerm)
    const filRes = res.filter((r) => {
      const nodeType = getNodeType(r.id)
      return nodeType !== NodeType.MISSING && nodeType !== NodeType.ARCHIVED
    })
    mog('search', { res, filRes })
    return filRes
  }

  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const nodeUID = useEditorStore((store) => store.node.nodeid)
  const baseNodeId = useDataStore((store) => store.baseNodeId)

  // console.log({ result })
  const onSelect = (item: GenericSearchResult) => {
    const nodeid = item.id
    loadNode(nodeid)
    goTo(ROUTE_PATHS.home, NavigationType.push, nodeid)
  }

  const onEscapeExit = () => {
    const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
    loadNode(nodeid)
    goTo(ROUTE_PATHS.editor, NavigationType.push, nodeid)
  }

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>, item: GenericSearchResult) => {
    e.preventDefault()
    const nodeid = item.id
    if (e.detail === 2) {
      loadNode(nodeid, { highlightBlockId: item.blockId })
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    }
  }

  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<GenericSearchResult>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const node = getNode(item.id, true)
    const nodeType = getNodeType(node.nodeid)
    if (!item || !node) {
      // eslint-disable-next-line
      // @ts-ignore
      return <Result {...props} ref={ref}></Result>
    }
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    const icon = node?.icon ?? (nodeType === NodeType.SHARED ? shareLine : fileList2Line)
    const edNode = node ? { ...node, title: node.path, id: node.nodeid } : getInitialNode()
    const isTagged = hasTags(edNode.nodeid)
    const id = `${item.id}_ResultFor_Search`
    // mog('Baseitem', { item, node, icon, nodeType })
    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultHeader active={item.matchField?.includes('title')}>
            <Icon icon={icon} />
            <ResultTitle>{node.path}</ResultTitle>
          </ResultHeader>
          <SearchPreviewWrapper active={item.matchField?.includes('text')}>
            <EditorPreviewRenderer content={content} editorId={`editor_${item.id}`} />
          </SearchPreviewWrapper>
          {isTagged && (
            <ResultCardFooter>
              <TagsRelatedTiny nodeid={edNode.nodeid} />
            </ResultCardFooter>
          )}
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain>
              <ResultTitle>{node.path}</ResultTitle>
              <ResultDesc>{item.text ?? convertContentToRawText(content, ' ')}</ResultDesc>
            </ResultMain>
            {(!splitOptions || splitOptions.type === SplitType.NONE) && (
              <ResultMetaData>
                <Metadata fadeOnHover={false} node={edNode} />
              </ResultMetaData>
            )}
          </ResultRow>
        </Result>
      )
    }
  }
  const RenderItem = React.forwardRef(BaseItem)

  const filterResults = (results: GenericSearchResult[]): GenericSearchResult[] => {
    const nFilters = generateNodeSearchFilters(results)
    setFilters(nFilters)
    const filtered = applyCurrentFilters(results)
    // mog('filtered', { filtered, nFilters, currentFilters, results })
    return filtered
  }

  const RenderFilters = (props: RenderFilterProps<GenericSearchResult>) => {
    return (
      <SearchFilters
        {...props}
        addCurrentFilter={addCurrentFilter}
        removeCurrentFilter={removeCurrentFilter}
        resetCurrentFilters={resetCurrentFilters}
        filters={filters}
        currentFilters={currentFilters}
      />
    )
  }

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    // mog('RenderPreview', { item })
    if (item) {
      const con = contents[item.id]
      const content = con ? con.content : defaultContent.content
      const node = getNode(item.id, true)
      const nodeType = getNodeType(node.nodeid)
      const icon = node?.icon ?? (nodeType === NodeType.SHARED ? shareLine : fileList2Line)
      const edNode = { ...node, title: node.path, id: node.nodeid }
      // mog('RenderPreview', { item, content, node })
      return (
        <SplitSearchPreviewWrapper id={`splitSearchPreview_for_${item.id}`}>
          <Title onMouseUp={(e) => onDoubleClick(e, item)}>
            <Icon icon={icon} />
            <TitleText>{node.path}</TitleText>
            <Metadata fadeOnHover={false} node={edNode} />
          </Title>
          <EditorPreviewRenderer
            content={content}
            blockId={item.blockId}
            onDoubleClick={(e) => onDoubleClick(e, item)}
            editorId={`SearchPreview_editor_${item.id}`}
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
        getItemKey={(i) => i.id}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        filterResults={filterResults}
        RenderFilters={RenderFilters}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
      />
    </SearchContainer>
  )
}

export default Search
