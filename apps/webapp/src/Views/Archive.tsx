import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'

import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import styled from 'styled-components'

import { Infobox } from '@workduck-io/mex-components'

import {
  batchArray,
  convertContentToRawText,
  extractMetadata,
  GenericSearchResult,
  getContent,
  mog,
  useContentStore,
  useDataStore
, useMetadataStore } from '@mexit/core'
import {
  ArchiveHelp,
  DefaultMIcons,
  FlexBetween,
  IconDisplay,
  MainHeader,
  Result,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper,
  Title,
  ViewType
} from '@mexit/shared'

import NamespaceTag from '../Components/NamespaceTag'
import { defaultContent } from '../Data/baseData'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useApi } from '../Hooks/API/useNodeAPI'
import { useNamespaces } from '../Hooks/useNamespaces'
import { useSearch } from '../Hooks/useSearch'
import { ModalHeader } from '../Style/Refactor'
import { deserializeContent } from '../Utils/serializer'
import { WorkerRequestType } from '../Utils/worker'
import { runBatchWorker } from '../Workers/controller'

import SearchView, { RenderItemProps, RenderPreviewProps } from './SearchView'

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const Archive = () => {
  const archive = useDataStore((store) => store.archive)
  const contents = useContentStore((store) => store.contents)
  const setContent = useContentStore((store) => store.setContent)
  const addMetadata = useMetadataStore((s) => s.addMetadata)

  const { getNamespace } = useNamespaces()
  const [showModal, setShowModal] = useState(false)
  const getDataAPI = useApi().getDataAPI
  const { queryIndex, updateDocument } = useSearch()

  const getArchiveResult = (nodeid: string): GenericSearchResult => {
    const node = archive.find((node) => node.nodeid === nodeid)
    const content = getContent(nodeid)

    return {
      id: nodeid,
      title: node.path,
      text: convertContentToRawText(content.content)
    }
  }

  const onSearch = async (newSearchTerm: string) => {
    const res = await queryIndex('archive', newSearchTerm)
    if (newSearchTerm === '' && res?.length === 0) {
      return initialArchive
    }
    return res
  }

  const initialArchive: GenericSearchResult[] = archive.map((n) => getArchiveResult(n.nodeid))

  useEffect(() => {
    const fetchArchiveContents = async () => {
      const unfetchedArchives = archive
        .filter((i) => contents[i.nodeid]?.content?.length === 0 || contents[i.nodeid] === undefined)
        .map((i) => i.nodeid)

      const ids = batchArray(unfetchedArchives, 10)
      mog('UnfetchedArchiveFetch', { ids, unfetchedArchives })
      const { fulfilled } = await runBatchWorker(WorkerRequestType.GET_ARCHIVED_NODES, 6, ids)

      fulfilled.forEach((nodes) => {
        if (nodes) {
          const { rawResponse } = nodes

          if (rawResponse) {
            rawResponse.forEach((nodeResponse) => {
              const metadata = extractMetadata(nodeResponse, { icon: DefaultMIcons.NOTE })
              const content = deserializeContent(nodeResponse.data)

              const nodeID = nodeResponse.id
              setContent(nodeID, content)

              if (metadata) addMetadata('notes', { [nodeID]: metadata })
              updateDocument('archive', nodeID, content)
            })
          }
        }
      })
    }
    fetchArchiveContents()
  }, [])

  // Forwarding ref to focus on the selected result
  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<GenericSearchResult>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    const node = archive.find((node) => node.nodeid === item.id)
    const id = `${item.id}_ResultFor_ArchiveSearch`
    const icon = useMetadataStore.getState().metadata.notes[node.nodeid]?.icon ?? DefaultMIcons.NOTE
    const namespace = getNamespace(node?.namespace)
    if (!item || !node) return null

    if (props.view === ViewType.Card) {
      return (
        // eslint-disable-next-line
        // @ts-ignore
        <Result {...props} key={id} ref={ref}>
          <ResultHeader>
            <ResultTitle>{node.path}</ResultTitle>
            <ActionContainer>{namespace && <NamespaceTag namespace={namespace} />}</ActionContainer>
          </ResultHeader>
          <SearchPreviewWrapper>
            <EditorPreviewRenderer content={content} editorId={`editor_archive_preview_${item.id}`} />
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === ViewType.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <IconDisplay icon={icon} />
            <ResultMain>
              <ResultTitle>
                <FlexBetween>
                  {node.path}
                  {namespace && <NamespaceTag namespace={namespace} />}
                </FlexBetween>
              </ResultTitle>
              <ResultDesc>{convertContentToRawText(content, ' ')}</ResultDesc>
            </ResultMain>
          </ResultRow>
        </Result>
      )
    }

    return null
  }
  const RenderItem = React.forwardRef(BaseItem)

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    if (!item) return null
    const node = archive.find((node) => node.nodeid === item.id)
    if (!node) return null
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    const icon = fileList2Line
    const namespace = getNamespace(node?.namespace)

    if (item) {
      return (
        <SplitSearchPreviewWrapper id={`splitArchiveSearchPreview_for_${item.id}`}>
          <Title>
            {node.path}
            {namespace && <NamespaceTag namespace={namespace} />}
          </Title>
          <EditorPreviewRenderer content={content} editorId={`SnippetSearchPreview_editor_${item.id}`} />
        </SplitSearchPreviewWrapper>
      )
    } else
      return (
        <SplitSearchPreviewWrapper>
          <Title></Title>
        </SplitSearchPreviewWrapper>
      )
  }
  // mog('Archive', { archive })

  return (
    <SearchContainer>
      <MainHeader>
        <Title>Archive</Title>
        <Infobox text={ArchiveHelp} />
      </MainHeader>

      <SearchView
        id="ArchiveSearch"
        key="ArchiveSearch"
        initialItems={initialArchive}
        onSearch={onSearch}
        getItemKey={(item) => `archive_${item.id}`}
        onSelect={(node) => {
          mog('onSelect: NodeSelected', { node })
        }}
        onEscapeExit={() => {
          setShowModal(false)
        }}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
      />
      <Modal
        className="ModalContent"
        overlayClassName="ModalOverlay"
        onRequestClose={() => setShowModal(false)}
        isOpen={showModal}
      >
        <ModalHeader>Archive</ModalHeader>
      </Modal>
    </SearchContainer>
  )
}

export default Archive
