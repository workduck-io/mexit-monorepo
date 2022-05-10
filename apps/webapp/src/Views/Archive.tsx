import unarchiveLine from '@iconify/icons-clarity/unarchive-line'
import trashIcon from '@iconify/icons-codicon/trash'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import { GenericSearchResult, convertContentToRawText, ILink, NodeProperties } from '@mexit/core'
import { MainHeader, Button } from '@mexit/shared'
import { mog } from '@workduck-io/mex-editor'
import React, { useState } from 'react'
import Modal from 'react-modal'
import styled, { useTheme } from 'styled-components'
import EditorPreviewRenderer from '../Components/EditorPreviewRenderer'
import Infobox from '../Components/Infobox'
import { defaultContent } from '../Data/baseData'
import { ArchiveHelp } from '../Data/defaultText'
import useArchive from '../Hooks/useArchive'
import useLoad from '../Hooks/useLoad'
import { useSaver } from '../Hooks/useSaver' // FIXME move useSaver to hooks
import { useSearch } from '../Hooks/useSearch'
import useContentStore from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { getContent } from '../Stores/useEditorStore'
import { Title } from '../Style/Elements'
import { ModalHeader, MRMHead, ModalControls } from '../Style/Refactor'
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
} from '../Style/Search'
import SearchView, { RenderItemProps, RenderPreviewProps } from './SearchView'
import { View } from './ViewSelector'

export const ArchivedNode = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  width: 16rem;
  height: 8rem;
  margin: 1rem;
  background-color: ${({ theme }) => theme.colors.background.card};
`

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
  const addILink = useDataStore((state) => state.addILink)

  const { unArchiveData, removeArchiveData } = useArchive()
  const [delNode, setDelNode] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const { loadNode } = useLoad()
  const contents = useContentStore((store) => store.contents)
  const theme = useTheme()
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
  const onUnarchiveClick = async (node: ILink) => {
    // const present = ilinks.find((link) => link.key === node.key)

    // if (present) {
    //   setShowModal(true)
    // }

    await unArchiveData([node])
    addILink({ ilink: node.path, nodeid: node.nodeid, archived: true })

    const content = getContent(node.nodeid)
    await removeDocument('archive', node.nodeid)

    await updateDocument('node', node.nodeid, content.content, node.path)

    const archiveNode: NodeProperties = {
      id: node.path,
      path: node.path,
      title: node.path,
      nodeid: node.nodeid
    }

    loadNode(node.nodeid, { savePrev: false, fetch: false, node: archiveNode })
  }

  const onDeleteClick = async () => {
    const nodesToDelete = archive.filter((i) => {
      const match = i.path.startsWith(delNode.path)
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
    if (!item || !node) return null

    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultHeader>
            <ResultTitle>{node.path}</ResultTitle>
            <ActionContainer>
              <StyledIcon
                fontSize={32}
                color={theme.colors.primary}
                onClick={(ev) => {
                  ev.preventDefault()
                  onUnarchiveClick(node)
                }}
                icon={unarchiveLine}
              />
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
              <ResultTitle>{node.path}</ResultTitle>
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
    if (item) {
      return (
        <SplitSearchPreviewWrapper id={`splitArchiveSearchPreview_for_${item.id}`}>
          <Title>
            {node.path}

            <ActionContainer>
              <StyledIcon
                fontSize={32}
                color={theme.colors.primary}
                onClick={(ev) => {
                  ev.preventDefault()
                  onUnarchiveClick(node)
                }}
                icon={unarchiveLine}
              />
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
        RenderItem={React.forwardRef(BaseItem)}
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
