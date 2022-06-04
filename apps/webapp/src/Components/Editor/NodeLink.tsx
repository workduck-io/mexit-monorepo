import React from 'react'

import useLoad from '../../Hooks/useLoad'
import { useLinks } from '../../Hooks/useLinks'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { NodeLinkStyled } from '../../Style/Backlinks'
import TippyPreviewEditor from '../Editor/TippyPreviewEditor'

interface NodeLinkProps {
  keyStr: string
  nodeid: string

  // Show preview (default true)
  preview?: boolean
  icon?: boolean
}

const NodeLink = ({ nodeid, preview = true, icon, keyStr }: NodeLinkProps) => {
  const { getPathFromNodeid } = useLinks()
  const { loadNode } = useLoad()
  const { goTo } = useRouting()

  return (
    <TippyPreviewEditor key={keyStr} nodeid={nodeid} placement="left">
      <NodeLinkStyled
        key={`NodeLink_${keyStr}`}
        onClick={() => {
          loadNode(nodeid, { savePrev: false })
          goTo(ROUTE_PATHS.editor, NavigationType.push, nodeid)
        }}
      >
        {getPathFromNodeid(nodeid)}
      </NodeLinkStyled>
    </TippyPreviewEditor>
  )
}

export default NodeLink
