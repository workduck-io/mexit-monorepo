import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ReactFlowState, useStore } from 'react-flow-renderer'

const selector = (s: ReactFlowState) => s.domNode?.querySelector('.react-flow__edgelabel-renderer')

function EdgeLabelRenderer({ children }: { children: ReactNode }) {
  const edgeLabelRenderer = useStore(selector)

  if (!edgeLabelRenderer) {
    return null
  }

  return createPortal(children, edgeLabelRenderer)
}

export default EdgeLabelRenderer
