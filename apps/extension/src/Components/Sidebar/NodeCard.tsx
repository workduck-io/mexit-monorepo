import React, { useState } from 'react'

import styled, { useTheme } from 'styled-components'

import { API_BASE_URLS, convertContentToRawText, DefaultMIcons, mog, WORKSPACE_HEADER } from '@mexit/core'
import {
  CopyButton,
  GenericFlex,
  IconDisplay,
  MexIcon,
  PrimaryText,
  SnippetCardWrapper,
  SnippetContentPreview
} from '@mexit/shared'

import { useAuthStore } from '../../Hooks/useAuth'
import { getTitleFromPath } from '../../Hooks/useLinks'
import { useNodes } from '../../Hooks/useNodes'
import { useContentStore } from '../../Stores/useContentStore'
import { useMetadataStore } from '../../Stores/useMetadataStore'
import { useRecentsStore } from '../../Stores/useRecentsStore'
import SnippetPreview from '../Editor/SnippetPreview'

export const NodeCardHeader = styled.div<{ $noHover?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  font-size: 1.1em;
  padding: ${({ theme }) => theme.spacing.tiny};
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.tokens.surfaces.separator};
  user-select: none;

  ${PrimaryText} {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`

export const HeadingFlex = styled(GenericFlex)`
  gap: ${({ theme }) => theme.spacing.small};
`

export const NodeCard = ({ nodeId }: { nodeId: string }) => {
  const { getNode } = useNodes()
  const theme = useTheme()
  const getContent = useContentStore((store) => store.getContent)
  const addInRecents = useRecentsStore((s) => s.addRecent)
  const notesMetadata = useMetadataStore((s) => s.metadata.notes[nodeId])
  const updateMetadata = useMetadataStore((s) => s.updateMetadata)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const [visible, setVisible] = useState(false)

  const closePreview = () => {
    setVisible(false)
  }

  const onTitleClick = (e) => {
    window.open(`${API_BASE_URLS.frontend}/editor/${nodeId}`, '_blank')
  }

  const isNodePublic = notesMetadata?.publicAccess

  const node = getNode(nodeId, true)
  const contents = getContent(nodeId)

  const flipPublicAccess = async () => {
    const workspaceHeaders = () => ({
      [WORKSPACE_HEADER]: getWorkspaceId(),
      Accept: 'application/json, text/plain, */*'
    })

    if (isNodePublic) {
      const request = {
        type: 'PUBLIC_SHARING',
        subType: 'MAKE_PRIVATE',
        body: {
          nodeId
        },
        headers: workspaceHeaders()
      }
      chrome.runtime.sendMessage(request, (response) => {
        const { message, error } = response

        if (error) {
          mog('ErrorMakingNodePrivate', error)
        } else {
          addInRecents(nodeId)
          updateMetadata('notes', nodeId, { publicAccess: false })
        }
      })
    } else {
      const request = {
        type: 'PUBLIC_SHARING',
        subType: 'MAKE_PUBLIC',
        body: {
          nodeId
        },
        headers: workspaceHeaders()
      }
      chrome.runtime.sendMessage(request, (response) => {
        const { message, error } = response

        if (error) {
          mog('ErrorMakingNodePublic', error)
        } else {
          addInRecents(nodeId)
          updateMetadata('notes', nodeId, { publicAccess: true })
        }
      })
    }
  }

  const onNotePublic = (event) => {
    event.stopPropagation()
    flipPublicAccess()
  }

  const noteTitle = getTitleFromPath(node?.path)

  if (!node) return

  return (
    <SnippetPreview
      key={node?.nodeid}
      hover
      disableClick
      title={noteTitle}
      preview={visible}
      onClick={onTitleClick}
      setPreview={setVisible}
      allowClosePreview
      nodeId={node?.nodeid}
      placement="left"
    >
      <SnippetCardWrapper>
        <NodeCardHeader $noHover>
          <HeadingFlex onClick={onTitleClick}>
            <IconDisplay color={theme.tokens.colors.primary.default} icon={notesMetadata?.icon ?? DefaultMIcons.NOTE} />
            <PrimaryText>{noteTitle}</PrimaryText>
          </HeadingFlex>
          <GenericFlex>
            {isNodePublic ? (
              <MexIcon height={16} width={16} icon="material-symbols:public" onClick={onNotePublic} />
            ) : (
              <MexIcon height={16} width={16} icon="material-symbols:public-off-rounded" onClick={onNotePublic} />
            )}
            {isNodePublic && (
              <CopyButton
                isIcon
                text={`${API_BASE_URLS.shareFrontend}/${nodeId}`}
                size="16px"
                beforeCopyTooltip="Copy link"
                afterCopyTooltip="Link copied!"
              />
            )}
          </GenericFlex>
        </NodeCardHeader>

        {/* TODO: saving raw content for nodes as well would be grand */}
        {contents?.content && (
          <SnippetContentPreview>{convertContentToRawText(contents.content, ' ')}</SnippetContentPreview>
        )}
      </SnippetCardWrapper>
    </SnippetPreview>
  )
}
