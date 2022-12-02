import React from 'react'

import arrowDownSLine from '@iconify/icons-ri/arrow-down-s-line'
import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import arrowUpSLine from '@iconify/icons-ri/arrow-up-s-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import markPenLine from '@iconify/icons-ri/mark-pen-line'
import { Icon } from '@iconify/react'

import { Highlight, Highlights, Link } from '@mexit/core'
import {
  HighlightCollapsedToggle,
  HighlightCount,
  HighlightGroupsWrapper,
  HighlightGroupToggleButton,
  HighlightNoteLink,
  HighlightText,
  SingleHighlightWrapper
} from '@mexit/shared'

import { useHighlights } from '../../Hooks/useHighlights'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'
import useLoad from '../../Hooks/useLoad'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

interface HighlightGroupProps {
  highlights?: Highlights
  link: Link
  setOpen: (open: boolean) => void
  open: boolean
}

export const HighlightGroupToggle = ({ highlights, open, setOpen }: HighlightGroupProps) => {
  const highlightCount = (highlights ?? []).length

  const toggleOpen = () => {
    setOpen(!open)
  }

  return highlightCount > 0 ? (
    <HighlightGroupToggleButton onClick={() => toggleOpen()}>
      <Icon icon={markPenLine} />
      Highlights <HighlightCount>{highlightCount}</HighlightCount>
      <Icon icon={open ? arrowUpSLine : arrowDownSLine} />
    </HighlightGroupToggleButton>
  ) : null
}

export const SingleHighlightWithToggle = ({ highlight }: { highlight: Highlight }) => {
  const { loadNode } = useLoad()
  const { goTo } = useRouting()
  const { getHighlightMap } = useHighlights()
  const { getPathFromNodeid } = useLinks()

  const [open, setOpen] = React.useState(false)
  const highlightMap = getHighlightMap(highlight.entityId)
  const highlightText = highlight?.properties?.saveableRange?.text ?? ''

  const willCollapse = highlightText.length > 300

  const strippedText = highlightText.substring(0, 300) + (willCollapse ? '...' : '')

  const toShowText = willCollapse ? (open ? highlightText : strippedText) : highlightText

  const openHighlightLocation = ({ nodeid }: { nodeid?: string }) => {
    // const nodeid = highlight.nodeId
    // Pass
    const blockId = highlightMap[nodeid][0]
    loadNode(nodeid, { highlightBlockId: blockId })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  return (
    <SingleHighlightWrapper onDoubleClick={() => openHighlightLocation({})}>
      <HighlightText>{toShowText}</HighlightText>
      {willCollapse ? (
        <HighlightCollapsedToggle onClick={() => setOpen(!open)}>
          <Icon icon={open ? arrowUpSLine : arrowRightSLine} />
          {open ? 'Less' : 'More'}
        </HighlightCollapsedToggle>
      ) : null}
      {Object.keys(highlightMap).map((nodeid) => (
        <HighlightNoteLink onClick={() => openHighlightLocation({ nodeid })}>
          <Icon icon={fileList2Line} />
          {getTitleFromPath(getPathFromNodeid(nodeid))}
        </HighlightNoteLink>
      ))}
    </SingleHighlightWrapper>
  )
}

const HighlightGroups = ({ highlights, link, open, setOpen }: HighlightGroupProps) => {
  return open && highlights ? (
    <HighlightGroupsWrapper>
      {highlights.map((highlight) => {
        return <SingleHighlightWithToggle key={`${highlight.entityId}`} highlight={highlight} />
      })}
    </HighlightGroupsWrapper>
  ) : null
}

export default HighlightGroups
