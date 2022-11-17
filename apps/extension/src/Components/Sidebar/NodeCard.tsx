import React, { useMemo } from 'react'

import { Icon } from '@iconify/react'
import toast from 'react-hot-toast'
import styled from 'styled-components'

import { convertContentToRawText, MEXIT_FRONTEND_URL_BASE, mog, WORKSPACE_HEADER } from '@mexit/core'
import {
  CenteredFlex,
  CopyButton,
  GenericFlex,
  SnippetCardFooter,
  SnippetCardHeader,
  SnippetCardWrapper,
  SnippetContentPreview,
  TagsLabel
} from '@mexit/shared'

import { useAuthStore } from '../../Hooks/useAuth'
import { getTitleFromPath } from '../../Hooks/useLinks'
import { useNodes } from '../../Hooks/useNodes'
import { useContentStore } from '../../Stores/useContentStore'
import useDataStore from '../../Stores/useDataStore'

export const NodeCardHeader = styled.div<{ $noHover?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  font-size: 1.15rem;
  cursor: pointer;
  user-select: none;
`

export const NodeCard = ({ nodeId }: { nodeId: string }) => {
  const { publicNodes, setNodePrivate, setNodePublic, checkNodePublic } = useDataStore()
  const { getNode } = useNodes()
  const getContent = useContentStore((store) => store.getContent)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const isNodePublic = useMemo(() => {
    return checkNodePublic(nodeId)
  }, [publicNodes])

  const node = getNode(nodeId)
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
          setNodePrivate(nodeId)
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
          setNodePublic(nodeId)
        }
      })
    }
  }

  return (
    <SnippetCardWrapper>
      <NodeCardHeader $noHover>
        <GenericFlex>
          <Icon icon="gg:file-document" />
          {getTitleFromPath(node?.path)}
        </GenericFlex>
        <GenericFlex>
          {isNodePublic ? (
            <Icon icon="material-symbols:public-off-rounded" onClick={() => flipPublicAccess()} />
          ) : (
            <Icon icon="material-symbols:public" onClick={() => flipPublicAccess()} />
          )}
          {isNodePublic && (
            <CopyButton
              text={`${MEXIT_FRONTEND_URL_BASE}/share/${nodeId}`}
              size="20px"
              beforeCopyTooltip="Copy link"
              afterCopyTooltip="Link copied!"
            />
          )}
        </GenericFlex>
      </NodeCardHeader>

      {/* TODO: saving raw content for nodes as well would be grand */}
      <SnippetContentPreview>{contents && convertContentToRawText(contents.content, ' ')}</SnippetContentPreview>

      <SnippetCardFooter>{/* <TagsLabel tags={}/> */}</SnippetCardFooter>
    </SnippetCardWrapper>
  )
}
