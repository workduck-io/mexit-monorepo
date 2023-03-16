import React, { useEffect } from 'react'

import { tinykeys } from '@workduck-io/tinykeys'

import { DefaultMIcons, NodeType, useMetadataStore,useMultipleEditors  } from '@mexit/core'
import { IconDisplay, SharedNodeIcon } from '@mexit/shared'

import EditorPreview from '../../Editor/Components/EditorPreview/EditorPreview'
// import EditorPreview from '../../Editor/Components/EditorPreview/EditorPreview'
import { useLinks } from '../../Hooks/useLinks'
import { useNavigation } from '../../Hooks/useNavigation'
import { useNodes } from '../../Hooks/useNodes'
// import { useOnMouseClick } from '../../Hooks/useOnMouseClick'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { NodeLinkStyled, NodeLinkTitleWrapper, NodeLinkWrapper } from '../../Style/Backlinks'

interface NodeLinkProps {
  keyStr: string
  nodeid: string

  blockId?: string

  // Show preview (default true)
  preview?: boolean
  icon?: boolean

  /**
   * Replace the default onclick action on node link
   */
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void

  /**
   * RenderActions
   */
  RenderActions?: () => JSX.Element
}

const NodeLink = ({ nodeid, blockId, preview = true, icon, keyStr, onClick, RenderActions }: NodeLinkProps) => {
  const [visible, setVisible] = React.useState(false)
  const isEditorPresent = useMultipleEditors((store) => store.editors)?.[nodeid]
  const { getPathFromNodeid, getILinkFromNodeid } = useLinks()
  const { getNodeType } = useNodes()
  const { goTo } = useRouting()
  const { push } = useNavigation()

  const addPreviewInEditors = useMultipleEditors((store) => store.addEditor)
  const nodeType = getNodeType(nodeid)
  const noteIcon = useMetadataStore((s) => s.metadata.notes[nodeid]?.icon)
  // const node = getNodeFrom

  const onClickProps = (ev) => {
    // Show preview on click, if preview is shown, navigate to link
    ev.preventDefault()
    ev.stopPropagation()

    if (ev.detail === 2) {
      if (onClick) {
        onClick(ev)
      } else {
        push(nodeid)
        goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
      }
    }

    addPreviewInEditors(nodeid)

    if (!visible) {
      setVisible(true)
    }
  }

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
  }

  return (
    <EditorPreview
      key={keyStr}
      preview={visible}
      label={nodeid}
      setPreview={setVisible}
      allowClosePreview={!isEditorPresent}
      // blockId={blockId}
      hover
      nodeid={nodeid}
      placement="auto-start"
    >
      <NodeLinkWrapper onClick={onClickProps}>
        <NodeLinkStyled selected={!!isEditorPresent} key={`NodeLink_${keyStr}`}>
          <NodeLinkTitleWrapper>
            {noteIcon ? (
              <IconDisplay icon={noteIcon} />
            ) : nodeType === NodeType.SHARED ? (
              <SharedNodeIcon />
            ) : (
              <IconDisplay icon={DefaultMIcons.NOTE} />
            )}
            {getPathFromNodeid(nodeid, true)}
          </NodeLinkTitleWrapper>
          {RenderActions && <RenderActions />}
        </NodeLinkStyled>
      </NodeLinkWrapper>
    </EditorPreview>
  )
}

export default NodeLink
