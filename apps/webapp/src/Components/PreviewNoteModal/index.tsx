import { useEffect, useMemo } from 'react'
import Modal from 'react-modal'

import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import { PlateProvider } from '@udecode/plate'
import { useTheme } from 'styled-components'

import { Button, MexIcon } from '@workduck-io/mex-components'

import {
  defaultContent,
  ModalsType,
  NodeEditorContent,
  NodeType,
  useContentStore,
  useMetadataStore,
  useModalStore
} from '@mexit/core'
import {
  EditorContainer,
  EditorPreviewControls,
  EditorPreviewNoteName,
  IconDisplay,
  PreviewActionHeader,
  sharedAccessIcon,
  Tooltip
} from '@mexit/shared'

import { useBufferStore, useEditorBuffer } from '../../Hooks/useEditorBuffer'
import { useLinks } from '../../Hooks/useLinks'
import { useNamespaces } from '../../Hooks/useNamespaces'
import { useNodes } from '../../Hooks/useNodes'
import { isReadonly, usePermissions } from '../../Hooks/usePermissions'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useTags } from '../../Hooks/useTags'
import Editor from '../Editor/Editor'
import { TagsRelatedTiny } from '../Editor/TagsRelated'
import NamespaceTag from '../NamespaceTag'

import { PreviewNoteContainer } from './styled'

const PreviewNoteModal = () => {
  const isOpen = useModalStore((store) => store.open === ModalsType.previewNote)
  const modalData = useModalStore((store) => store.data)
  const toggleModal = useModalStore((store) => store.toggleOpen)
  const addValueInBuffer = useBufferStore((store) => store.add)
  const getContent = useContentStore((store) => store.getContent)
  const noteMetadata = useMetadataStore((s) => s.metadata.notes[modalData?.noteId])
  const contentStore = useContentStore((s) => s.contents[modalData?.noteId])

  const theme = useTheme()
  const { getNodeType, getSharedNode } = useNodes()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { getNamespace } = useNamespaces()
  const { hasTags } = useTags()
  const { getTitleFromNoteId, getILinkFromNodeid } = useLinks()
  const { goTo } = useRouting()

  const content = useMemo(() => {
    const data = getContent(modalData?.noteId)
    return data?.content || defaultContent.content
  }, [modalData, contentStore])

  const { noteTitle, noteLink } = useMemo(() => {
    return {
      noteTitle: getTitleFromNoteId(modalData?.noteId, { includeShared: true }),
      noteLink: getILinkFromNodeid(modalData?.noteId, true)
    }
  }, [modalData?.noteId])

  const { accessWhenShared } = usePermissions()
  const readOnly = useMemo(() => isReadonly(accessWhenShared(modalData?.noteId)), [modalData?.noteId])

  useEffect(() => {
    if (isOpen) saveAndClearBuffer(false)
  }, [isOpen])

  if (!isOpen) return <></>

  const onRequestClose = () => {
    toggleModal(undefined)
  }

  const onChange = (val: NodeEditorContent) => {
    addValueInBuffer(modalData?.noteId, val)
  }

  const onTagClick = (tag: string) => {
    toggleModal(undefined)
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  const onClickNoteTitle = (ev) => {
    ev.preventDefault()
    goTo(ROUTE_PATHS.node, NavigationType.push, modalData?.noteId)
    toggleModal(undefined)
  }

  const nodeType = getNodeType(modalData?.noteId)
  const sharedNode = nodeType === NodeType.SHARED ? getSharedNode(modalData?.noteId) : undefined
  const namespace = getNamespace(noteLink.namespace)

  const iconTooltip = sharedNode?.currentUserAccess && `You have ${sharedNode?.currentUserAccess?.toLowerCase()} access`
  const icon = sharedAccessIcon[sharedNode?.currentUserAccess]

  return (
    <Modal
      className={'ModalContentSplit'}
      overlayClassName="ModalOverlay"
      onRequestClose={onRequestClose}
      isOpen={isOpen}
    >
      <PlateProvider id={modalData?.noteId}>
        <PreviewNoteContainer>
          <EditorPreviewControls hasTags={hasTags(modalData?.noteId)}>
            {
              <PreviewActionHeader>
                <EditorPreviewNoteName onClick={onClickNoteTitle}>
                  <IconDisplay icon={noteMetadata?.icon} />
                  {noteTitle}
                  {namespace && <NamespaceTag namespace={namespace} />}
                </EditorPreviewNoteName>
                {icon && iconTooltip && (
                  <Tooltip key="close-icon" content={iconTooltip}>
                    <MexIcon color={theme.colors.gray[5]} noHover icon={icon} height={16} width={16} />
                  </Tooltip>
                )}
              </PreviewActionHeader>
            }
            <PreviewActionHeader>
              <TagsRelatedTiny onClick={onTagClick} nodeid={modalData?.noteId} />
              <Button
                onClick={(ev) => {
                  ev.preventDefault()
                  ev.stopPropagation()

                  onRequestClose()
                }}
              >
                <MexIcon noHover height={20} width={20} icon={closeCircleLine} />
              </Button>
            </PreviewActionHeader>
          </EditorPreviewControls>
          <EditorContainer>
            <Editor
              focusBlockId={modalData?.blockId}
              content={content}
              onChange={onChange}
              options={{ focusOptions: false }}
              readOnly={readOnly}
              autoFocus
              nodeUID={modalData?.noteId}
            />
          </EditorContainer>
        </PreviewNoteContainer>
      </PlateProvider>
    </Modal>
  )
}

export default PreviewNoteModal
