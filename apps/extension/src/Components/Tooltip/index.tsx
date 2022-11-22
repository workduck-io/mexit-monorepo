import React, { useMemo, useRef, useState } from 'react'

import toast from 'react-hot-toast'

import { AccessLevel, extractMetadata, MEXIT_FRONTEND_URL_BASE, mog, SEPARATOR } from '@mexit/core'
import { copyTextToClipboard, HighlightNote, Popover, Tooltip as FloatingTooltip } from '@mexit/shared'

import { useAuthStore } from '../../Hooks/useAuth'
import { useEditorStore } from '../../Hooks/useEditorStore'
import { useHighlighter } from '../../Hooks/useHighlighter'
import { useInternalLinks } from '../../Hooks/useInternalLinks'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'
// different import path!
import { getElementById } from '../../contentScript'
import { useHighlights } from '../../Hooks/useHighlights'
import { useMentions } from '../../Hooks/useMentions'
import { useNodes } from '../../Hooks/useNodes'
import useRaju from '../../Hooks/useRaju'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { useContentStore } from '../../Stores/useContentStore'
import { useHighlightStore2 } from '../../Stores/useHighlightStore'
import { useMentionStore } from '../../Stores/useMentionsStore'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { useUserCacheStore } from '../../Stores/useUserCacheStore'
import { deserializeContent } from '../../Utils/serializer'
import { MentionTooltipComponent } from '../MentionTooltip'
import { ProfileImage } from '../ProfileImage'
import { Icon as Iconify } from '@iconify/react'
import { Icon, NoteListWrapper, ProfileImageContainer, StyledTooltip } from './styled'

function Tooltip() {
  const { setVisualState } = useSputlitContext()
  const tooltipState = useSputlitStore((s) => s.highlightTooltipState)
  const setTooltipState = useSputlitStore((s) => s.setHighlightTooltipState)
  const { setPreviewMode, setNodeContent } = useEditorStore()
  const highlights = useHighlightStore2((s) => s.highlights)
  const { getHighlightMap, getEditableMap } = useHighlights()
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
  const [editListOpen, setEditListOpen] = useState(false)

  mog('tooltipState', { tooltipState })

  const highlightMap = getHighlightMap(tooltipState?.id)
  const editableMap = getEditableMap(tooltipState?.id)

  const editNodes = useMemo(() => {
    return Object.keys(editableMap).map((nodeId) => {
      const node = getILinkFromNodeid(nodeId, true)
      return node
    })
  }, [editableMap])

  const rootRef = useRef<HTMLDivElement>(null)

  // FIXME: A single nodeid is dangerous
  // This node id is the first node id in the editable notes
  const isEditable = useMemo(() => Object.keys(editableMap ?? {}).length > 0, [editableMap])
  const nodeId = editNodes[0]?.nodeid

  const highlight = highlights.find((h) => h.entityId === tooltipState?.id)

  const { getUserFromUserid } = useMentions()
  // const { getUserDetailsUserId } = useUserService()

  const user = useMemo(() => {
    if (isSharedNode(nodeId)) {
      const sharedNode = getSharedNode(nodeId)
      const u = getUserFromUserid(sharedNode?.owner)

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
        // This is not blockID anymore mia amore
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

  // used to open the note in the sputlit editor
  //const handleEdit = () => {
  //   mog('edit, UNIMPLEMENTED')
  //   return
  //   const content = getContent(nodeId)
  //   const node = getILinkFromNodeid(nodeId)
  //   setVisualState(VisualState.animatingIn)

  //   // TODO: the timeout is because the nodeContent setting in the content/index.ts according to the active item works as well
  //   // will optimize later
  //   setTimeout(() => {
  //     setNode({ ...node, title: node.path.split(SEPARATOR).slice(-1)[0], id: node.nodeid })
  //     setNodeContent(content.content)
  //     setPreviewMode(false)
  //   }, 500)

  //   setTooltipState({ visualState: VisualState.hidden })
  // }

  const handleCopyClipboard = async (text: string) => {
    await copyTextToClipboard(text)
    setTooltipState({ visualState: VisualState.hidden })
  }

  const openNodeInMexit = (nodeid: string) => {
    window.open(`${MEXIT_FRONTEND_URL_BASE}/editor/${nodeid}`, '_blank', 'noopener, noreferrer')
  }

  // TODO: add multiple color choice in tooltip
  // mog('tooltipState', {
  //   tooltipState,
  //   editListOpen,
  //   highlightMap,
  //   editableMap,
  //   editNodes,
  //   nodeId,
  //   highlight,
  //   isEditable
  // })

  return (
    <StyledTooltip
      id="mexit-tooltip"
      top={window.scrollY + tooltipState.coordinates.top}
      left={window.scrollX + tooltipState.coordinates.left}
      showTooltip={tooltipState.visualState === VisualState.hidden ? false : true}
    >
      {isEditable &&
        (editNodes.length > 1 ? (
          <>
            <Popover
              rootRef={rootRef}
              placement="top"
              render={() => (
                <NoteListWrapper>
                  {editNodes.map((node) => (
                    <HighlightNote onClick={() => openNodeInMexit(node.nodeid)}>
                      <Iconify icon="mdi:file-document-outline" />
                      {getTitleFromPath(node.path)}
                    </HighlightNote>
                  ))}
                </NoteListWrapper>
              )}
            >
              <Icon>
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
            </Popover>
            <div ref={rootRef} />
          </>
        ) : (
          <Icon onClick={() => openNodeInMexit(nodeId)}>
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
        ))}
      {isEditable && (
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
    </StyledTooltip>
  )
}

export default Tooltip
