import React from 'react'
import ReactDOM from 'react-dom'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'

interface Props {
  children: React.ReactNode
}

export function TooltipPortal(props: Props) {
  const tooltipState = useSputlitContext().tooltipState

  if (tooltipState.visualState === VisualState.hidden) {
    return null
  }

  return ReactDOM.createPortal(props.children, document.body)
}
