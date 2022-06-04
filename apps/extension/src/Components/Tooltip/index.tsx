import React from 'react'
import Highlighter from 'web-highlighter'
import { copyToClipboard } from '@mexit/shared'
import { Icon, StyledTooltip } from './styled'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import toast from 'react-hot-toast'
import { NodeEditorContent } from '@mexit/core'
import { useContentStore } from '../../Stores/useContentStore'

function Tooltip() {
  const { setVisualState, tooltipState, setTooltipState, setSelection } = useSputlitContext()

  // const content = useContentStore((store) => store.getContent(window.location.href)).find(
  //   (item) => item.highlighterId === tooltipState.id
  // ).content

  const removeContent = useContentStore((store) => store.removeContent)
  const highligter = new Highlighter()

  const handleDelete = () => {
    // TODO: send request to backed to remove the same
    highligter.remove(tooltipState.id)
    // removeContent(window.location.href, tooltipState.id)
    toast.success('Highlight removed')

    setTooltipState({ visualState: VisualState.hidden })
  }

  const handleEdit = () => {
    setVisualState(VisualState.showing)
    // setSelection({ editContent: content })
    setTooltipState({ visualState: VisualState.hidden })
  }

  const handleCopyClipboard = async (content: NodeEditorContent) => {
    const parts = []
    content?.forEach((p) => {
      parts.push(p.text)
    })
    const text = parts.join('')

    await copyToClipboard(text)
    setTooltipState({ visualState: VisualState.hidden })
  }

  // TODO: add multiple color choice in tooltip

  return (
    <StyledTooltip
      top={window.scrollY + tooltipState.coordinates.top}
      left={window.scrollX + tooltipState.coordinates.left}
      showTooltip={tooltipState.visualState === VisualState.hidden ? false : true}
    >
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

      <Icon onClick={() => handleCopyClipboard([])}>
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
    </StyledTooltip>
  )
}

export default Tooltip
