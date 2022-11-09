import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from 'react-modal'

import { Title, LoadingButton } from '@workduck-io/mex-components'

import type { Snippet } from '@mexit/core'
import { TemplateContainer, ButtonFields } from '@mexit/shared'

import { defaultContent } from '../../Data/baseData'
import EditorPreviewRenderer from '../../Editor/EditorPreviewRenderer'
import { useApi } from '../../Hooks/API/useNodeAPI'
import { useLinks, getTitleFromPath } from '../../Hooks/useLinks'
import { useContentStore } from '../../Stores/useContentStore'
import useModalStore, { ModalsType } from '../../Stores/useModalStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { PrimaryText } from '../EditorInfobar/BlockInfobar'
import { InviteWrapper, InviteFormWrapper } from '../Mentions/styles'
import SidebarList from '../Sidebar/SidebarList'
import { RemovalButton } from './TemplateModal.styles'

const TemplateModal = () => {
  const { getILinkFromNodeid } = useLinks()
  const { toggleOpen, open, data } = useModalStore()

  const { nodeid, namespace } = data ?? {}

  const node = getILinkFromNodeid(nodeid)
  const templates = useSnippetStore((state) => state.snippets).filter((item) => item?.template)

  const [currentTemplate, setCurrentTemplate] = useState<Snippet>()
  const [selectedTemplate, setSelectedTemplate] = useState<Snippet>()

  const getMetadata = useContentStore((store) => store.getMetadata)
  const getContent = useContentStore((store) => store.getContent)
  const { saveDataAPI } = useApi()

  useEffect(() => {
    const contents = useContentStore.getState().contents
    const metadata = contents[nodeid]?.metadata
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
    const content = getContent(nodeid)

    if (nodeid) {
      saveDataAPI(nodeid, namespace, content.content, undefined, undefined, selectedTemplate?.id)
      toast('Template Set!')
    }

    toggleOpen(ModalsType.template)
  }

  const onRemove = async () => {
    const content = getContent(nodeid)

    if (nodeid) {
      // For why '__null__' see useSaveApi.tsx line 151
      saveDataAPI(nodeid, namespace, content.content, undefined, undefined, '__null__')
      toast('Template Removed!')
    }

    toggleOpen(ModalsType.template)
  }

  return (
    <Modal
      className="ModalContent"
      overlayClassName="ModalOverlay"
      onRequestClose={() => toggleOpen(ModalsType.template)}
      isOpen={open === ModalsType.template}
    >
      <InviteWrapper>
        {templates.length !== 0 ? (
          !currentTemplate ? (
            <>
              <Title>Set Template for {getTitleFromPath(node?.path)}</Title>
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
              primary
              large
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
