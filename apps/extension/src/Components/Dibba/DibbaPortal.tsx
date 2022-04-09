import React from 'react'
import ReactDOM from 'react-dom'
import { styleSlot } from '../../contentScript'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'

interface Props {
  children: React.ReactNode
}

export function DibbaPortal(props: Props) {
  const dibbaState = useSputlitContext().dibbaState

  if (dibbaState.visualState === VisualState.hidden) {
    return null
  }

  return ReactDOM.createPortal(props.children, styleSlot)
}
