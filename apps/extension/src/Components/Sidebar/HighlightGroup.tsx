import React, { useMemo } from 'react'

import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import arrowUpSLine from '@iconify/icons-ri/arrow-up-s-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'

import { API_BASE_URLS, Highlight, Highlights, mog, useDataStore } from '@mexit/core'
import {
  HighlightCollapsedToggle,
  HighlightGroupsWrapper,
  HighlightNote,
  HighlightNotes,
  HighlightText,
  SingleHighlightWrapper
} from '@mexit/shared'

import { useHighlights } from '../../Hooks/useHighlights'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'

const HIGHLIGHT_TEXT_MAX_LENGTH = 300

export const SingleHighlightWithToggle = ({ highlight }: { highlight: Highlight }) => {
  const [open, setOpen] = React.useState(false)
  // const showOpen =
  const highlightText = highlight.properties.saveableRange.text
  const { getEditableMap } = useHighlights()
  const { getILinkFromNodeid } = useLinks()

  const editableMap = getEditableMap(highlight.entityId)

  const editNodes = useMemo(() => {
    return Object.keys(editableMap).map((nodeId) => {
      const node = getILinkFromNodeid(nodeId, true)
      return node
    })
  }, [editableMap])

  const isEditable = useMemo(() => Object.keys(editableMap ?? {}).length > 0, [editableMap])
  mog('IS EDITABLE', { isEditable, editNodes, i: useDataStore.getState().ilinks })
  const nodeId = editNodes[0]?.nodeid

  const willCollapse = highlightText.length > HIGHLIGHT_TEXT_MAX_LENGTH

  const strippedText = highlightText.substring(0, HIGHLIGHT_TEXT_MAX_LENGTH) + (willCollapse ? '...' : '')

  const toShowText = willCollapse ? (open ? highlightText : strippedText) : highlightText

  const openHighlight = () => {
    const element = document.querySelector(`[data-highlight-id="${highlight.entityId}"]`)

    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const openNodeInMexit = (nodeid: string) => {
    window.open(`${API_BASE_URLS.frontend}/editor/${nodeid}`, '_blank', 'noopener, noreferrer')
  }

  return (
    <SingleHighlightWrapper onClick={() => openHighlight()}>
      <HighlightText>{toShowText}</HighlightText>
      {willCollapse ? (
        <HighlightCollapsedToggle onClick={() => setOpen(!open)}>
          <Icon icon={open ? arrowUpSLine : arrowRightSLine} />
          {open ? 'Less' : 'More'}
        </HighlightCollapsedToggle>
      ) : null}

      <HighlightNotes>
        {isEditable
          ? editNodes.map((node) => (
              <HighlightNote onClick={() => openNodeInMexit(node.nodeid)}>
                <Icon icon={fileList2Line} />
                {getTitleFromPath(node.path)}
              </HighlightNote>
            ))
          : null}
      </HighlightNotes>
    </SingleHighlightWrapper>
  )
}

export const HighlightGroups = ({ highlights }: { highlights: Highlights }) => {
  return open && highlights ? (
    <HighlightGroupsWrapper>
      {highlights.map((highlight) => {
        return <SingleHighlightWithToggle key={`${highlight.entityId}`} highlight={highlight} />
      })}
    </HighlightGroupsWrapper>
  ) : null
}
