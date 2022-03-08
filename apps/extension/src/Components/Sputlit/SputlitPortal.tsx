import React from 'react'
import ReactDOM from 'react-dom'
import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'

interface Props {
  children: React.ReactNode
}

export function SputlitPortal(props: Props) {
  const visualState = useSputlitContext().visualState

  if (visualState === VisualState.hidden) {
    return null
  }

  return ReactDOM.createPortal(props.children, document.body)
}
