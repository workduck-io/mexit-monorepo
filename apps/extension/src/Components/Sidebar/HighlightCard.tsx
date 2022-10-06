import React from 'react'

import styled from 'styled-components'

import { SnippetCardWrapper, SnippetContentPreview } from '@mexit/shared'

import { useNodes } from '../../Hooks/useNodes'
import { Highlighted } from '../../Stores/useHighlightStore'

const HighlightCardWrapper = styled(SnippetCardWrapper)`
  margin: 0.5rem 0;
`

interface HighlightCardProps {
  highlights: Highlighted['sourceURL']['blockId'][]
  nodeId: string
  preview?: boolean
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const HighlightCard = ({ highlights, nodeId, preview = true, onClick }: HighlightCardProps) => {
  const { getNode } = useNodes()

  const node = getNode(nodeId, true)

  const onClickProps = (ev) => {
    ev.preventDefault()

    if (onClick) {
      onClick(ev)
    }
  }

  // TODO: style this and add expand to card content
  return (
    <div>
      <p>{node?.path}</p>

      {highlights.map((highlight) => (
        <HighlightCardWrapper>
          <SnippetContentPreview>{highlight.elementMetadata.saveableRange.text}</SnippetContentPreview>
        </HighlightCardWrapper>
      ))}
    </div>
  )
}
