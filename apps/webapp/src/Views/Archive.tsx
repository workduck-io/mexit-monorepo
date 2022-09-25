import React, { useEffect, useState } from 'react'

import unarchiveLine from '@iconify/icons-clarity/unarchive-line'
import trashIcon from '@iconify/icons-codicon/trash'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import Modal from 'react-modal'
import styled, { useTheme } from 'styled-components'

import { Button, Infobox } from '@workduck-io/mex-components'

import { GenericSearchResult, convertContentToRawText, ILink, NodeProperties, mog, SEPARATOR } from '@mexit/core'
import { MainHeader } from '@mexit/shared'
import { Title } from '@mexit/shared'
import {
  Result,
  ResultHeader,
  ResultTitle,
  SearchPreviewWrapper,
  ResultRow,
  ResultMain,
  ResultDesc,
  SplitSearchPreviewWrapper,
  SearchContainer
} from '@mexit/shared'
import { View } from '@mexit/shared'

import NamespaceTag from '../Components/NamespaceTag'
import { defaultContent } from '../Data/baseData'
import { ArchiveHelp } from '../Data/defaultText'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import { useApi } from '../Hooks/API/useNodeAPI'
import useArchive from '../Hooks/useArchive'
import useLoad from '../Hooks/useLoad'
import { useNamespaces } from '../Hooks/useNamespaces'
import { useNewNodes } from '../Hooks/useNewNodes'
import { NavigationType, useRouting } from '../Hooks/useRouting'
import { useSearch } from '../Hooks/useSearch'
import { useContentStore } from '../Stores/useContentStore'
import { useDataStore } from '../Stores/useDataStore'
import { getContent } from '../Stores/useEditorStore'
import { ModalHeader, MRMHead, ModalControls } from '../Style/Refactor'
import SearchView, { RenderItemProps, RenderPreviewProps } from './SearchView'

const StyledIcon = styled(Icon)`
  cursor: pointer;
  padding: 0.4rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  :hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const Archive = () => {
  const archive = useDataStore((store) => store.archive)

  const { getNamespace } = useNamespaces()
  const { unArchiveData, removeArchiveData } = useArchive()
  const [delNode, setDelNode] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const { loadNode } = useLoad()
  const { contents, setContent } = useContentStore()
  const theme = useTheme()
  const getDataAPI = useApi().getDataAPI
  const { queryIndex } = useSearch()

  const { updateDocument, removeDocument } = useSearch()

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
    if (newSearchTerm === '' && res.length === 0) {
      return initialArchive
    }
    return res
  }

  const initialArchive: GenericSearchResult[] = archive.map((n) => getArchiveResult(n.nodeid))
  const { addNodeOrNodes } = useNewNodes()
  const { goTo } = useRouting()
  const onUnarchiveClick = async (node: ILink) => {
    // const present = ilinks.find((link) => link.key === node.key)

    // if (present) {
    //   setShowModal(true)
    // }

    await unArchiveData([node])
    await addNodeOrNodes(node.path, false, undefined, undefined, false)

    const content = getContent(node.nodeid)
    await removeDocument('archive', node.nodeid)

    await updateDocument('node', node.nodeid, content.content, node.path)

    const archiveNode: NodeProperties = {
      id: node.path,
      path: node.path,
      title: node.path.split(SEPARATOR).pop(),
      nodeid: node.nodeid,
      namespace: node?.namespace
    }

    loadNode(node.nodeid, { savePrev: false, fetch: false, node: archiveNode })
    goTo(node.path, NavigationType.replace)
  }

  const onDeleteClick = async () => {
    const nodesToDelete = archive.filter((i) => {
      const match = i.path.startsWith(delNode.title)
      return match
    })

    await removeArchiveData(nodesToDelete)

    nodesToDelete.forEach(async (node) => {
      await removeDocument('archive', node.nodeid)
    })

    // onSave()

    setShowModal(false)
  }

  const handleCancel = () => {
    setShowModal(false)
    setDelNode(undefined)
  }

  useEffect(() => {
    try {
      Promise.allSettled(
        archive.map(
          async (item) =>
            await getDataAPI(item.nodeid).then((response) =>
              setContent(item.nodeid, response.content, response.metadata)
            )
        )
      )
    } catch (err) {
      mog('Failed to fetch archives', { err })
    }
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
    const icon = fileList2Line
    const namespace = getNamespace(node?.namespace)
    if (!item || !node) return null

    if (props.view === View.Card) {
      return (
        // eslint-disable-next-line
        // @ts-ignore
        <Result {...props} key={id} ref={ref}>
          <ResultHeader>
            <ResultTitle>{node.path}</ResultTitle>
            <ActionContainer>
              {namespace && <NamespaceTag namespace={namespace} />}
              {/* <StyledIcon
                fontSize={32}
                color={theme.colors.primary}
                onClick={(ev) => {
                  ev.preventDefault()
                  onUnarchiveClick(node)
                }}
                icon={unarchiveLine}
              /> */}

              <StyledIcon
                fontSize={32}
                color="#df7777"
                onClick={(ev) => {
                  ev.preventDefault()
                  setDelNode(item)
                  setShowModal(true)
                }}
                icon={trashIcon}
              />
            </ActionContainer>
          </ResultHeader>
          <SearchPreviewWrapper>
            <EditorPreviewRenderer content={content} editorId={`editor_archive_preview_${item.id}`} />
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain>
              <ResultTitle>
                {node.path}
                {namespace && <NamespaceTag namespace={namespace} />}
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
            <ActionContainer>
              {/* <StyledIcon
                fontSize={32}
                color={theme.colors.primary}
                onClick={(ev) => {
                  ev.preventDefault()
                  onUnarchiveClick(node)
                }}
                icon={unarchiveLine}
              /> */}
              <StyledIcon
                fontSize={32}
                color="#df7777"
                onClick={(ev) => {
                  ev.preventDefault()
                  setDelNode(item)
                  setShowModal(true)
                }}
                icon={trashIcon}
              />
            </ActionContainer>
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
          setDelNode(undefined)
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
        <MRMHead>
          {!delNode && <h1>Node with same name is present in the workspace.</h1>}
          <p>Are you sure you want to {delNode ? 'delete' : 'replace'}?</p>
        </MRMHead>
        <ModalControls>
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <Button large primary onClick={onDeleteClick}>
            {delNode ? 'Delete' : 'Replace'}
          </Button>
        </ModalControls>
      </Modal>
    </SearchContainer>
  )
}

export default Archive
