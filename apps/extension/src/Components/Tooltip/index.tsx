import React, { useMemo, useRef } from 'react'
import toast from 'react-hot-toast'

import { API_BASE_URLS, mog, useHighlightStore } from '@mexit/core'
import { copyTextToClipboard } from '@mexit/shared'

import { useHighlighter } from '../../Hooks/useHighlighter'
import { useHighlights } from '../../Hooks/useHighlights'
import { useLinks } from '../../Hooks/useLinks'
import { VisualState } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'

import { Icon, StyledTooltip } from './styled'

function Tooltip() {
  //
  // TODO: add multiple color choice in tooltip
  //
  const tooltipState = useSputlitStore((s) => s.highlightTooltipState)
  const setTooltipState = useSputlitStore((s) => s.setHighlightTooltipState)
  const highlights = useHighlightStore((s) => s.highlights)
  const { deleteHighlight, getEditableMap } = useHighlights()
  const { getILinkFromNodeid } = useLinks()
  const { removeHighlight } = useHighlighter()

  // mog('tooltipState', { tooltipState })

  const editableMap = getEditableMap(tooltipState?.id)

  const editNodes = useMemo(() => {
    return Object.keys(editableMap).map((nodeId) => {
      const node = getILinkFromNodeid(nodeId, true)
      return node
    })
  }, [editableMap])

  const rootRef = useRef<HTMLDivElement>(null)

  const isEditable = useMemo(() => Object.keys(editableMap ?? {}).length > 0, [editableMap])
  // This node id is the first node id in the editable notes
  const nodeId = editNodes[0]?.nodeid

  const highlight = highlights.find((h) => h.entityId === tooltipState?.id)

  const handleDelete = () => {
    const blockMap = useHighlightStore.getState().highlightBlockMap
    mog('delete, IMPLEMENTED', { blockMap })

    deleteHighlight(tooltipState?.id).then(() => {
      // mog('deleted')
      toast.success('Highlight removed')
      removeHighlight(tooltipState?.id)
      setTooltipState({ visualState: VisualState.hidden })
    })
  }

  const handleCopyClipboard = async (text: string) => {
    await copyTextToClipboard(text)
    setTooltipState({ visualState: VisualState.hidden })
  }

  const openNodeInMexit = (nodeid: string) => {
    window.open(`${API_BASE_URLS.frontend}/editor/${nodeid}`, '_blank', 'noopener, noreferrer')
  }

  return (
    <StyledTooltip
      id="mexit-tooltip"
      top={window.scrollY + tooltipState.coordinates.top}
      left={window.scrollX + tooltipState.coordinates.left}
      showTooltip={tooltipState.visualState === VisualState.hidden ? false : true}
    >
      {/* {isEditable &&
        (editNodes.length > 1 ? (
          <>
            <Popover
              rootRef={rootRef}
              placement="top"
              render={() => (
                <NoteListWrapper>
                  {editNodes.map((node) => (
                    <HighlightNote onClick={() => openNodeInMexit(node.nodeid)}>
                      <Iconify icon={fileList2Line} />
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </Icon>
        ))} */}

      <Icon onClick={() => handleCopyClipboard(highlight.properties.saveableRange.text)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
      </Icon>

      {isEditable && (
        <Icon onClick={handleDelete}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </Icon>
      )}

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
