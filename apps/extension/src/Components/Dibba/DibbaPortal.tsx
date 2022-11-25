import React from 'react'

import ReactDOM from 'react-dom'

import { useSputlitContext, VisualState } from '../../Hooks/useSputlitContext'
import { styleSlot } from '../../Utils/cs-utils'

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
