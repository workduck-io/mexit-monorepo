import React, { useEffect } from 'react'

import { tinykeys } from '@workduck-io/tinykeys'

import { NodeType } from '@mexit/core'
import { SharedNodeIcon } from '@mexit/shared'

import EditorPreview from '../../Editor/Components/EditorPreview/EditorPreview'
// import EditorPreview from '../../Editor/Components/EditorPreview/EditorPreview'
import { useLinks } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { useNodes } from '../../Hooks/useNodes'
import { useOnMouseClick } from '../../Hooks/useOnMouseClick'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { NodeLinkStyled } from '../../Style/Backlinks'

interface NodeLinkProps {
  keyStr: string
  nodeid: string

  // Show preview (default true)
  preview?: boolean
  icon?: boolean
}

const NodeLink = ({ nodeid, preview = true, icon, keyStr }: NodeLinkProps) => {
  const [visible, setVisible] = React.useState(false)
  const [fixVisible, setFixVisible] = React.useState(false)
  const { getPathFromNodeid } = useLinks()
  const { getNodeType } = useNodes()
  const { goTo } = useRouting()
  const { push } = useNavigation()

  const nodeType = getNodeType(nodeid)

  const onClickProps = useOnMouseClick(() => {
    // Show preview on click, if preview is shown, navigate to link
    if (!fixVisible) setFixVisible(true)
    else {
      push(nodeid)
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    }
  })

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        closePreview()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const closePreview = () => {
    setVisible(false)
    setFixVisible(false)
  }

  return (
    <EditorPreview
      key={keyStr}
      preview={visible || fixVisible}
      closePreview={() => closePreview()}
      allowClosePreview={fixVisible}
      nodeid={nodeid}
      placement="auto-start"
    >
      <NodeLinkStyled
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        selected={fixVisible}
        key={`NodeLink_${keyStr}`}
        {...onClickProps}
      >
        {nodeType === NodeType.SHARED && <SharedNodeIcon />}

        {getPathFromNodeid(nodeid, true)}
      </NodeLinkStyled>
    </EditorPreview>
  )
}

export default NodeLink
