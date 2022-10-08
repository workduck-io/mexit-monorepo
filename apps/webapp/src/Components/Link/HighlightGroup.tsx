import { groupBy } from 'lodash'
import React from 'react'
import arrowDownSLine from '@iconify/icons-ri/arrow-down-s-line'
import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import arrowUpSLine from '@iconify/icons-ri/arrow-up-s-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import markPenLine from '@iconify/icons-ri/mark-pen-line'
import { SingleHighlight, SourceHighlights } from '../../Stores/useHighlightStore'
import { Link } from '../../Stores/useLinkStore'
import { mog } from '@mexit/core'
import {
  HighlightCollapsedToggle,
  HighlightCount,
  HighlightGroupHeader,
  HighlightGroupsWrapper,
  HighlightGroupToggleButton,
  HighlightGroupWrapper,
  HighlightText,
  SingleHighlightWrapper
} from './Link.style'
import { Icon } from '@iconify/react'
import { getTitleFromPath, useLinks } from '../../Hooks/useLinks'

interface HighlightGroupProps {
  highlights?: SourceHighlights
  link: Link
  setOpen: (open: boolean) => void
  open: boolean
}

export const HighlightGroupToggle = ({ highlights, open, setOpen }: HighlightGroupProps) => {
  const highlightCount = Object.keys(highlights ?? {}).length

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

export const SingleHighlightWithToggle = ({ highlight }: { highlight: SingleHighlight }) => {
  const [open, setOpen] = React.useState(false)
  // const showOpen =
  const highlightText = highlight.elementMetadata.saveableRange.text

  const willCollapse = highlightText.length > 300

  const strippedText = highlightText.substring(0, 300) + (willCollapse ? '...' : '')

  const toShowText = willCollapse ? (open ? highlightText : strippedText) : highlightText

  const openHighlight = () => {
    // Pass
  }

  return (
    <SingleHighlightWrapper>
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

const HighlightGroups = ({ highlights, link, open, setOpen }: HighlightGroupProps) => {
  const grouped = highlights ? groupBy(Object.values(highlights), 'nodeId') : {}
  const { getPathFromNodeid } = useLinks()

  // mog('grouped Highlights', { grouped })

  return open && highlights ? (
    <HighlightGroupsWrapper>
      {Object.keys(grouped).map((nodeId) => {
        const nodeHighlights = grouped[nodeId]
        const path = getPathFromNodeid(nodeId)
        const title = getTitleFromPath(path)
        // mog('nodeHighlights', { nodeHighlights, path, title })
        return (
          <HighlightGroupWrapper key={nodeId}>
            <HighlightGroupHeader>
              <Icon icon={fileList2Line} />
              {title}
            </HighlightGroupHeader>
            {nodeHighlights.map((highlight, i) => {
              return <SingleHighlightWithToggle key={`${highlight.nodeId}_${i}`} highlight={highlight} />
            })}
          </HighlightGroupWrapper>
        )
      })}
    </HighlightGroupsWrapper>
  ) : null
}

export default HighlightGroups
