import React, { useMemo, useState } from 'react'

import Tippy from '@tippyjs/react/headless'
import toast from 'react-hot-toast'

import { AccessLevel, extractMetadata, MEXIT_FRONTEND_URL_BASE, mog, SEPARATOR } from '@mexit/core'
import { copyTextToClipboard, Tooltip as FloatingTooltip } from '@mexit/shared'

import { useAuthStore } from '../../Hooks/useAuth'
import { useEditorStore } from '../../Hooks/useEditorStore'
import { useHighlighter } from '../../Hooks/useHighlighter'
import { useInternalLinks } from '../../Hooks/useInternalLinks'
import { useLinks } from '../../Hooks/useLinks'
// different import path!
import { useMentions } from '../../Hooks/useMentions'
import { useNodes } from '../../Hooks/useNodes'
import useRaju from '../../Hooks/useRaju'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { useContentStore } from '../../Stores/useContentStore'
import { useHighlightStore, useHighlightStore2 } from '../../Stores/useHighlightStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { useUserCacheStore } from '../../Stores/useUserCacheStore'
import { deserializeContent } from '../../Utils/serializer'
import { getElementById } from '../../contentScript'
import { MentionTooltipComponent } from '../MentionTooltip'
import { ProfileImage } from '../ProfileImage'
import { Icon, ProfileImageContainer, StyledTooltip } from './styled'
import { useHighlights } from '../../Hooks/useHighlights'

function Tooltip() {
  const { setVisualState } = useSputlitContext()
  const tooltipState = useSputlitStore((s) => s.highlightTooltipState)
  const setTooltipState = useSputlitStore((s) => s.setHighlightTooltipState)
  const { setPreviewMode, setNodeContent } = useEditorStore()
  const highlights = useHighlightStore2((s) => s.highlights)
  const { getHighlightMap } = useHighlights()
  const setNode = useSputlitStore((s) => s.setNode)
  const { getILinkFromNodeid } = useLinks()
  const { getContent } = useContentStore()
  const { getParentILink } = useInternalLinks()
  const workspaceDetails = useAuthStore((state) => state.workspaceDetails)
  const { dispatch } = useRaju()
  const { isSharedNode, getSharedNode } = useNodes()
  const { cache } = useUserCacheStore()
  const { removeHighlight } = useHighlighter()
  const removeHighlightFromStore = useHighlightStore2((s) => s.removeHighlight)
  const mentionable = useMentionStore((state) => state.mentionable)

  const highlightMap = getHighlightMap(tooltipState?.id)
  // FIXME: A single nodeid is dangerous
  const nodeId = Object.keys(highlightMap)[0] ?? undefined
  const highlight = highlights.find((h) => h.entityId === tooltipState?.id)
  const [access, setAccess] = useState<AccessLevel>()

  const { getUserFromUserid } = useMentions()
  // const { getUserDetailsUserId } = useUserService()

  const user = useMemo(() => {
    if (isSharedNode(nodeId)) {
      const sharedNode = getSharedNode(nodeId)
      const u = getUserFromUserid(sharedNode?.owner)
      setAccess(sharedNode.currentUserAccess)

      return u
    }
  }, [mentionable, cache, nodeId])

  const handleDelete = () => {
    /** FIXME:
     *
     * The delete now requires deletion of blocks across notes!
     * Add new subtype to the runtime
     */

    mog('delete, UNIMPLEMENTED')
    return
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
        namespaceID: node.namespace,
        workspaceID: workspaceDetails.id,
        metadata: {}
      }
    }

    chrome.runtime.sendMessage(request, (response) => {
      const { message, error } = response
      mog('MESSAGE OF DELETION', { message, request })

      if (error) {
        toast.error('An Error Occured. Please try again.')
      } else {
        const nodeid = message.id
        const content = deserializeContent(message.data)
        const metadata = extractMetadata(message)

        removeHighlight(tooltipState?.id)
        removeHighlightFromStore(tooltipState?.id)

        dispatch('SET_CONTENT', nodeid, content, metadata)

        toast.success('Highlight removed')
      }
    })

    setTooltipState({ visualState: VisualState.hidden })
  }

  const handleEdit = () => {
    mog('edit, UNIMPLEMENTED')
    return
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
      {/* {access !== 'READ' && (
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
      )} */}

      {access !== 'READ' && (
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
      )}

      <Icon onClick={() => handleCopyClipboard(highlight.properties.saveableRange.text)}>
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
          <FloatingTooltip
            root={getElementById('mexit-tooltip')}
            content={<MentionTooltipComponent user={user} nodeid={nodeId} access={access} />}
          >
            <ProfileImageContainer>
              {user?.email && <ProfileImage email={user?.email} size={24} />}
            </ProfileImageContainer>
          </FloatingTooltip>
        </Icon>
      )}
    </StyledTooltip>
  )
}

export default Tooltip
