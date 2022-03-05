import React, { useEffect, useState } from 'react'
import { useContentStore } from '../../Hooks/useContentStore'
import Highlighter from 'web-highlighter'
import { copyToClipboard } from '@mexit/shared'
import { Icon, StyledTooltip } from './styled'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'

function Tooltip() {
  const { setVisualState, tooltipState, setTooltipState } = useSputlitContext()

  const content = useContentStore((store) => store.getContent(window.location.href)).find(
    (item) => item.highlighterId === tooltipState.id
  ).content

  const removeContent = useContentStore((store) => store.removeContent)
  const highligter = new Highlighter()

  const handleDelete = () => {
    highligter.remove(tooltipState.id)
    setTooltipState({ visualState: VisualState.hidden })
    removeContent(window.location.href, tooltipState.id)
  }

  const handleEdit = () => {
    setVisualState(VisualState.showing)

    setTooltipState({ visualState: VisualState.hidden })
  }

  const handleCopyClipboard = async () => {
    const parts = []
    content?.forEach((p) => {
      p.children.forEach((e: any) => {
        parts.push(e.text)
      })
      parts.push(' ')
    })
    const text = parts.join('')
    await copyToClipboard(text)
  }

  // TODO: add multiple color choice in tooltip

  return (
    <StyledTooltip
      top={window.scrollY + tooltipState.coordinates.top}
      left={window.scrollX + tooltipState.coordinates.left}
      showTooltip={tooltipState.visualState === VisualState.hidden ? false : true}
    >
      <Icon onClick={handleEdit}>
        <img alt="Pencil Icon" src={chrome.runtime.getURL('/Assets/edit.svg')} />
      </Icon>

      <Icon onClick={handleDelete}>
        <img alt="Delete Icon" src={chrome.runtime.getURL('/Assets/trash.svg')} />
      </Icon>

      <Icon onClick={handleCopyClipboard}>
        <img alt="Clipboard Icon" src={chrome.runtime.getURL('/Assets/clipboard.svg')} />
      </Icon>
    </StyledTooltip>
  )
}

export default Tooltip
