import React from 'react'

import ReactDOM from 'react-dom'

import { VisualState } from '../../Hooks/useSputlitContext'
import { useSputlitStore } from '../../Stores/useSputlitStore'
import { styleSlot } from '../../contentScript'

interface Props {
  children: React.ReactNode
}

export function TooltipPortal(props: Props) {
  const tooltipState = useSputlitStore((s) => s.highlightTooltipState)

  if (tooltipState.visualState === VisualState.hidden) {
    return null
  }

  return ReactDOM.createPortal(props.children, styleSlot)
}
