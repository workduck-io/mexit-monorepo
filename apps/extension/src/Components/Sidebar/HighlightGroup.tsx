import React from 'react'

import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import arrowUpSLine from '@iconify/icons-ri/arrow-up-s-line'
import { Icon } from '@iconify/react'

import {
    Highlight,
    Highlights
} from '@mexit/core'
import {
    HighlightCollapsedToggle, HighlightGroupsWrapper, HighlightText,
    SingleHighlightWrapper
} from '@mexit/shared'


export const SingleHighlightWithToggle = ({ highlight }: { highlight: Highlight }) => {
  const [open, setOpen] = React.useState(false)
  // const showOpen =
  const highlightText = highlight.properties.saveableRange.text

  const willCollapse = highlightText.length > 300

  const strippedText = highlightText.substring(0, 300) + (willCollapse ? '...' : '')

  const toShowText = willCollapse ? (open ? highlightText : strippedText) : highlightText

  const openHighlight = () => {
    const element = document.querySelector(`[data-highlight-id="${highlight.entityId}"]`)

    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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

export const HighlightGroups = ({ highlights }: { highlights: Highlights }) => {
  return open && highlights ? (
    <HighlightGroupsWrapper>
      {highlights.map((highlight) => {
        return <SingleHighlightWithToggle key={`${highlight.entityId}`} highlight={highlight} />
      })}
    </HighlightGroupsWrapper>
  ) : null
}
