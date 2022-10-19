import React from 'react'

import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import arrowUpSLine from '@iconify/icons-ri/arrow-up-s-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import { groupBy } from 'lodash'
import styled from 'styled-components'

import { MEXIT_FRONTEND_URL_BASE, mog, SingleHighlight, SourceHighlights } from '@mexit/core'
import {
  HighlightCollapsedToggle,
  HighlightGroupHeader,
  HighlightGroupsWrapper,
  HighlightGroupWrapper,
  HighlightText,
  SingleHighlightWrapper,
  SnippetCardWrapper
} from '@mexit/shared'

import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'

export const SingleHighlightWithToggle = ({ highlight, blockId }: { highlight: SingleHighlight; blockId: string }) => {
  const [open, setOpen] = React.useState(false)
  // const showOpen =
  const highlightText = highlight.elementMetadata.saveableRange.text

  const willCollapse = highlightText.length > 300

  const strippedText = highlightText.substring(0, 300) + (willCollapse ? '...' : '')

  const toShowText = willCollapse ? (open ? highlightText : strippedText) : highlightText

  const openHighlight = () => {
    const nodeid = highlight.nodeId
    // Pass
    // mog('highlight clikec', { highlight })
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
    </SingleHighlightWrapper>
  )
}

export const HighlightGroups = ({ highlights }: { highlights: SourceHighlights }) => {
  const grouped = highlights ? groupBy(Object.entries(highlights), (val) => val[1].nodeId) : {}

  const { getPathFromNodeid } = useLinks()

  const openNote = (nodeid: string) => {
    window.open(`${MEXIT_FRONTEND_URL_BASE}/node/${nodeid}`, '_blank')
  }

  return (
    <HighlightGroupsWrapper>
      {Object.keys(grouped).map((nodeId) => {
        const nodeHighlights = grouped[nodeId]
        const path = getPathFromNodeid(nodeId)
        const title = getTitleFromPath(path)
        // mog('nodeHighlights', { nodeHighlights, path, title })
        return (
          <HighlightGroupWrapper key={nodeId}>
            <HighlightGroupHeader onDoubleClick={() => openNote(nodeId)}>
              <Icon icon={fileList2Line} />
              {title}
            </HighlightGroupHeader>
            {nodeHighlights.map(([blockId, highlight], i) => {
              return (
                <SingleHighlightWithToggle key={`${highlight.nodeId}_${i}`} blockId={blockId} highlight={highlight} />
              )
            })}
          </HighlightGroupWrapper>
        )
      })}
    </HighlightGroupsWrapper>
  )
}
