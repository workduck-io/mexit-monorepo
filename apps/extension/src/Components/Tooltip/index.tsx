import React, { useEffect, useMemo, useState } from 'react'
import Highlighter from 'web-highlighter'
import {
  AccessTag,
  Button,
  copyTextToClipboard,
  MentionTooltip,
  MentionTooltipContent,
  SMention,
  SMentionRoot,
  TooltipAlias,
  TooltipMail
} from '@mexit/shared'
import { Icon, ProfileImageContainer, StyledTooltip } from './styled'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import toast from 'react-hot-toast'
import {
  AccessLevel,
  CacheUser,
  extractMetadata,
  InvitedUser,
  Mentionable,
  MEXIT_FRONTEND_URL_BASE,
  NodeEditorContent,
  SelfMention,
  SEPARATOR
} from '@mexit/core'
import { useContentStore } from '../../Stores/useContentStore'
import { useLinks } from '../../Hooks/useLinks'
import { useEditorContext } from '../../Hooks/useEditorContext'
import { useHighlightStore } from '../../Stores/useHighlightStore'
import { useSaveChanges } from '../../Hooks/useSaveChanges'
import { useInternalLinks } from '../../Hooks/useInternalLinks'
import { useAuthStore } from '../../Hooks/useAuth'
import useRaju from '../../Hooks/useRaju'
import { deserializeContent } from '../../Utils/serializer'
import { useNodes } from '../../Hooks/useNodes'
import { useUserCacheStore } from '../../Stores/useUserCacheStore'
import { ProfileImage } from '../ProfileImage'
import Tippy from '@tippyjs/react/headless' // different import path!
import { useMentions } from '../../Hooks/useMentions'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { styleSlot } from '../../contentScript'
import { MentionTooltipComponent } from '../MentionTooltip'

function Tooltip() {
  const { setVisualState, tooltipState, setTooltipState, setSelection } = useSputlitContext()
  const { setNode, setPreviewMode, setNodeContent } = useEditorContext()
  const { highlighted } = useHighlightStore()

  const { getILinkFromNodeid } = useLinks()
  const { getContent, removeContent } = useContentStore()
  const { getParentILink } = useInternalLinks()
  const workspaceDetails = useAuthStore((state) => state.workspaceDetails)
  const { dispatch } = useRaju()
  const { isSharedNode, getSharedNode } = useNodes()
  const { getUser, cache } = useUserCacheStore()
  const mentionable = useMentionStore((state) => state.mentionable)

  const nodeId = highlighted[window.location.href][tooltipState.id].nodeId

  const { getUserFromUserid, getUserAccessLevelForNode } = useMentions()
  // const { getUserDetailsUserId } = useUserService()

  const user = useMemo(() => {
    if (isSharedNode(nodeId)) {
      const sharedNode = getSharedNode(nodeId)
      const u = getUserFromUserid(sharedNode?.owner)

      return u
    }
  }, [mentionable, cache, nodeId])

  const access = getUserAccessLevelForNode(user?.email, nodeId)

  const handleDelete = () => {
    const content = getContent(nodeId)
    const node = getILinkFromNodeid(nodeId)
    const parentILink = getParentILink(node.path)

    const request = {
      type: 'CAPTURE_HANDLER',
      subType: 'SAVE_NODE',
      data: {
        id: node.nodeid,
        title: node.path.split(SEPARATOR).slice(-1)[0],
        content: content.content.filter((item) => item.id !== tooltipState.id),
        referenceID: parentILink?.nodeid,
        workspaceID: workspaceDetails.id,
        metadata: {}
      }
    }

    chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response

      if (error) {
        toast.error('An Error Occured. Please try again.')
      } else {
        const nodeid = message.id
        const content = deserializeContent(message.data)
        const metadata = extractMetadata(message)

        dispatch('SET_CONTENT', {
          nodeid,
          content,
          metadata
        })

        toast.success('Highlight removed')
      }
    })

    setTooltipState({ visualState: VisualState.hidden })
  }

  const handleEdit = () => {
    const content = getContent(nodeId)
    const node = getILinkFromNodeid(nodeId)
    setVisualState(VisualState.animatingIn)

    // TODO: the timeout is because the nodeContent setting in the content/index.ts according to the active item works as well
    // will optimize later
    setTimeout(() => {
      setNode({ ...node, title: node.path.split(SEPARATOR).slice(-1)[0], id: node.nodeid })
      setNodeContent(content.content)
      setPreviewMode(false)
    }, 500)

    setTooltipState({ visualState: VisualState.hidden })
  }

  const handleCopyClipboard = async (text: string) => {
    await copyTextToClipboard(text)
    setTooltipState({ visualState: VisualState.hidden })
  }

  // TODO: add multiple color choice in tooltip

  return (
    <StyledTooltip
      id="mexit-tooltip"
      top={window.scrollY + tooltipState.coordinates.top}
      left={window.scrollX + tooltipState.coordinates.left}
      showTooltip={tooltipState.visualState === VisualState.hidden ? false : true}
    >
      <Icon onClick={handleEdit}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      </Icon>

      <Icon onClick={handleDelete}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </Icon>

      <Icon
        onClick={() =>
          handleCopyClipboard(highlighted[window.location.href][tooltipState.id].elementMetadata.saveableRange.text)
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      </Icon>

      {user?.email && (
        <Icon
          onClick={() => window.open(`${MEXIT_FRONTEND_URL_BASE}/editor/${nodeId}`, '_blank', 'noopener, noreferrer')}
        >
          <Tippy
            interactive
            placement="bottom"
            appendTo={() => document.getElementById('mexit').shadowRoot.getElementById('mexit-tooltip')}
            render={(attrs) => <MentionTooltipComponent user={user} nodeid={nodeId} access={access} />}
          >
            <ProfileImageContainer>
              {user?.email && <ProfileImage email={user?.email} size={24} />}
            </ProfileImageContainer>
          </Tippy>
        </Icon>
      )}
    </StyledTooltip>
  )
}

export default Tooltip
