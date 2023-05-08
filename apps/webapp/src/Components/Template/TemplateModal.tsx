import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from 'react-modal'

import { useTheme } from 'styled-components'

import { LoadingButton, Title } from '@workduck-io/mex-components'

import { API, ModalsType, mog, Snippet, useMetadataStore, useModalStore, useSnippetStore } from '@mexit/core'
import { ButtonFields, DefaultMIcons, FlexBetween, MexIcon, TemplateContainer } from '@mexit/shared'

import { defaultContent } from '../../Data/baseData'
import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'
import { PrimaryText } from '../EditorInfobar/BlockInfobar'
import { InviteFormWrapper, InviteWrapper } from '../Mentions/styles'
import SidebarList from '../Sidebar/SidebarList'

import { RemovalButton } from './TemplateModal.styles'

const TemplateModal = () => {
  const theme = useTheme()
  const { getILinkFromNodeid } = useLinks()
  const { toggleOpen, open, data } = useModalStore()

  const { nodeid } = data ?? {}

  const node = getILinkFromNodeid(nodeid)
  const snippets = useSnippetStore((state) => state.snippets) ?? {}
  const templates = Object.values(snippets).filter((item) => item?.template)
  const updateMetadataInStore = useMetadataStore((s) => s.updateMetadata)

  const [currentTemplate, setCurrentTemplate] = useState<Snippet>()
  const [selectedTemplate, setSelectedTemplate] = useState<Snippet>()

  useEffect(() => {
    const metadata = useMetadataStore.getState().metadata.notes[nodeid]
    if (metadata?.templateID) {
      const template = templates.find((item) => item.id === metadata.templateID)
      setCurrentTemplate(template)
      setSelectedTemplate(template)
    } else {
      setSelectedTemplate(templates[0])
    }

    return () => {
      setCurrentTemplate(undefined)
    }
  }, [nodeid, open])

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm()

  const onSelectItem = (id: string) => {
    setSelectedTemplate(templates.find((item) => item.id === id))
  }

  const onSubmit = async () => {
    if (nodeid) {
      const existingMetadata = useMetadataStore.getState().metadata.notes[nodeid]
      const newMeta = { icon: existingMetadata.icon, templateID: selectedTemplate?.id }
      mog('META', { newMeta })
      API.node
        .updateMetadata(nodeid, { metadata: newMeta })
        .then((r) => {
          updateMetadataInStore('notes', nodeid, newMeta)
          toast('Tempate set!')
        })
        .catch((err) => {
          console.error('Unable to set Template', { err })
        })
    }

    toggleOpen(ModalsType.template)
  }

  const onRemove = async () => {
    if (nodeid) {
      // For why '__null__' see useSaveApi.tsx line 151
      const existingMetadata = useMetadataStore.getState().metadata.notes[nodeid]
      const newMetadata = { icon: existingMetadata.icon, templateID: undefined }
      API.node
        .updateMetadata(nodeid, { metadata: newMetadata })
        .then((r) => {
          updateMetadataInStore('notes', nodeid, newMetadata)
        })
        .catch((err) => {
          console.error('Unable to set Template', { err })
        })
    }

    toggleOpen(ModalsType.template)
  }

  const onRequestClose = () => {
    toggleOpen(ModalsType.template)
  }

  return (
    <Modal
      className="ModalContent"
      overlayClassName="ModalOverlay"
      onRequestClose={onRequestClose}
      isOpen={open === ModalsType.template}
    >
      <InviteWrapper>
        {templates.length !== 0 ? (
          !currentTemplate ? (
            <>
              <FlexBetween>
                <Title>Set Template for {getTitleFromPath(node?.path)}</Title>
                <MexIcon
                  color={theme.tokens.text.fade}
                  $cursor
                  height={24}
                  width={24}
                  icon={DefaultMIcons.CLEAR.value}
                  onClick={onRequestClose}
                />
              </FlexBetween>
              <p>Auto fill new notes using template</p>
            </>
          ) : (
            <>
              <Title>Update Template for {getTitleFromPath(node?.path)}</Title>
              <p>
                Currently using <PrimaryText>{currentTemplate.title}</PrimaryText>
              </p>
            </>
          )
        ) : (
          <Title>No templates found</Title>
        )}
        <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
          {templates.length !== 0 && (
            <TemplateContainer>
              <SidebarList
                items={templates.map(({ title, ...t }) => ({ ...t, label: title, data: t }))}
                onClick={onSelectItem}
                selectedItemId={selectedTemplate?.id}
                noMargin
                showSearch
                searchPlaceholder="Filter Templates..."
                emptyMessage="No Templates Found"
              />
              <section>
                <EditorPreviewRenderer
                  noMouseEvents
                  placeholder="Select a template"
                  content={selectedTemplate?.content || defaultContent.content}
                  editorId={selectedTemplate?.id || 'selected template'}
                />
              </section>
            </TemplateContainer>
          )}
          <ButtonFields position="end">
            {currentTemplate && (
              <RemovalButton
                loading={isSubmitting}
                alsoDisabled={
                  errors?.templateID !== undefined ||
                  errors?.nodeid !== undefined ||
                  templates?.length === 0 ||
                  currentTemplate.id !== selectedTemplate?.id
                }
                onClick={onRemove}
                large
              >
                Remove Template
              </RemovalButton>
            )}
            <LoadingButton
              loading={isSubmitting}
              alsoDisabled={
                errors?.templateID !== undefined ||
                errors?.nodeid !== undefined ||
                templates?.length === 0 ||
                currentTemplate?.id === selectedTemplate?.id
              }
              type="submit"
            >
              Set Template
            </LoadingButton>
          </ButtonFields>
        </InviteFormWrapper>
      </InviteWrapper>
    </Modal>
  )
}

export default TemplateModal
