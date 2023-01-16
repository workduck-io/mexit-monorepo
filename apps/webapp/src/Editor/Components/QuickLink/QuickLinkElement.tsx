import React, { useEffect, useState } from 'react'
import { useMatch } from 'react-router-dom'

import archivedIcon from '@iconify/icons-ri/archive-line'
import eyeOffLine from '@iconify/icons-ri/eye-off-line'
import shareLine from '@iconify/icons-ri/share-line'
import { moveSelection, useEditorRef } from '@udecode/plate'
import { useFocused, useSelected } from 'slate-react'

import { tinykeys } from '@workduck-io/tinykeys'

import { ILink, NodeType, SharedNode } from '@mexit/core'
import { ILinkElementProps, sharedAccessIcon, SILink, SILinkRoot, StyledIcon } from '@mexit/shared'

import { useLinks } from '../../../Hooks/useLinks'
import { useNavigation } from '../../../Hooks/useNavigation'
import { useNodes } from '../../../Hooks/useNodes'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import useMultipleEditors from '../../../Stores/useEditorsStore'
import { getBlock } from '../../../Utils/parseData'
import EditorPreview from '../EditorPreview/EditorPreview'

/**
 * ILinkElement with no default styles. [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling) */
const SharedNodeLink = ({
  selected,
  sharedNode,
  onClick
}: {
  selected: boolean
  sharedNode: SharedNode
  onClick: any
}) => {
  return (
    <SILink $selected={selected} onClick={onClick}>
      <StyledIcon icon={shareLine} />
      <span className="ILink_decoration ILink_decoration_left">[[</span>
      <span className="ILink_decoration ILink_decoration_value"> {sharedNode?.path}</span>
      <span className="ILink_decoration ILink_decoration_right">]]</span>
    </SILink>
  )
}

const ArchivedNode = ({ selected, archivedNode }: { selected: boolean; archivedNode: ILink }) => {
  return (
    <SILink $selected={selected} color="#df7777">
      <StyledIcon icon={archivedIcon} color="#df7777" />
      <span className="ILink_decoration ILink_decoration_left">[[</span>
      <span className="ILink_decoration ILink_decoration_value"> {archivedNode?.path}</span>
      <span className="ILink_decoration ILink_decoration_right">]]</span>
    </SILink>
  )
}

const MissingNode = ({ selected }: { selected: boolean }) => {
  return (
    <SILink $selected={selected}>
      <StyledIcon icon={eyeOffLine} />
      <span className="ILink_decoration ILink_decoration_left">[[</span>
      <span className="ILink_decoration ILink_decoration_value">Private/Missing</span>
      <span className="ILink_decoration ILink_decoration_right">]]</span>
    </SILink>
  )
}

export const QuickLinkElement = ({ attributes, children, element }: ILinkElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const [preview, setPreview] = useState(false)
  const { push } = useNavigation()
  const { getPathFromNodeid } = useLinks()
  const { getArchiveNode, getSharedNode, getNodeType } = useNodes()
  // const spotlightCtx = useSpotlightContext()
  // const noteCtx = useNoteContext()
  const timer = React.useRef(undefined)

  const path = getPathFromNodeid(element.value)
  const { goTo } = useRouting()
  // const isSpotlightCtx = useSpotlightContext()
  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)

  // const { setPreviewEditorNode } = useSpotlightEditorStore((store) => ({
  //   setPreviewEditorNode: store.setNode
  // }))
  const addPreviewInEditors = useMultipleEditors((store) => store.addEditor)
  const changeEditorState = useMultipleEditors((store) => store.changeEditorState)
  const isEditingPreview = useMultipleEditors((store) => store.isEditingAnyPreview)

  const loadLinkNode = async (nodeid: string) => {
    // if (spotlightCtx) {
    //   const node = getNode(nodeid)
    //   nodeid = node.nodeid
    //   setPreviewEditorNode(node)
    // } else if (noteCtx) {
    //   openNodeInMex(nodeid)
    // } else {
    push(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    // }
  }

  const blinkPreview = (noteId: string) => {
    if (timer.current) clearTimeout(timer.current)
    changeEditorState(noteId, { blink: true })

    // * After 2 seconds set blink false
    timer.current = setTimeout(() => changeEditorState(noteId, { blink: false }), 2000)
  }

  const isPreviewPresent = (noteId: string) => {
    const existingPreview = useMultipleEditors.getState().editors[noteId]
    return existingPreview
  }

  const onPreviewShow = (noteId: string) => {
    const existingPreview = isPreviewPresent(noteId)
    const currentMainNode = match?.params?.nodeid

    if (currentMainNode === noteId) return

    // if (isSpotlightCtx) {
    //   setPreview(true)
    //   return
    // }

    if (existingPreview) {
      blinkPreview(noteId)
      return
    }

    addPreviewInEditors(noteId)
    setPreview(true)
  }

  const onClickProps = (e) => {
    // Show preview on click, if preview is shown, navigate to link
    e.preventDefault()
    e.stopPropagation()

    const noteId = element.value

    if (!preview) {
      onPreviewShow(noteId)
    } else {
      loadLinkNode(noteId)
    }
  }

  useEffect(() => {
    // If the preview is shown and the element losses focus --> Editor focus is moved
    // Hide the preview
    if (preview && !selected) {
      setPreview(false)
    }
  }, [selected])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Backspace: (event) => {
        if (selected && focused && editor.selection) {
          moveSelection(editor)
        }
      },
      Enter: (ev) => {
        // Show preview on Enter, if preview is shown, navigate to link
        if (selected && focused && editor.selection) {
          if (!preview) {
            onPreviewShow(element.value)
          }
        }

        // Once preview is shown the link looses focus
        if (preview && !isEditingPreview()) {
          loadLinkNode(element.value)
        }
      },
      Delete: (ev) => {
        if (selected && focused && editor.selection) {
          moveSelection(editor, { reverse: true })
        }
      }
    })

    return () => unsubscribe()
  }, [element, selected, focused, preview])

  const nodeType = getNodeType(element.value)
  const block = element.blockId ? getBlock(element.value, element.blockId) : undefined
  const content = block ? [block] : undefined
  const archivedNode = nodeType === NodeType.ARCHIVED ? getArchiveNode(element.value) : undefined
  const sharedNode = nodeType === NodeType.SHARED ? getSharedNode(element.value) : undefined

  return (
    <SILinkRoot
      {...attributes}
      id={`ILINK_${element.value}`}
      data-tour="mex-onboarding-ilink"
      data-slate-value={element.value}
      contentEditable={false}
    >
      {
        // TODO: Don't use this conditional rendering method
        // The key to the temporary object defines what to render
        {
          [NodeType.SHARED]: (
            <EditorPreview
              placement="auto"
              preview={preview}
              nodeid={element.value}
              allowClosePreview
              iconTooltip={
                sharedNode?.currentUserAccess && `You have ${sharedNode?.currentUserAccess?.toLowerCase()} access`
              }
              icon={sharedAccessIcon[sharedNode?.currentUserAccess]}
              editable={sharedNode?.currentUserAccess !== 'READ'}
              content={content}
              setPreview={setPreview}
            >
              <SILink $selected={selected} onClick={onClickProps}>
                <StyledIcon icon={shareLine} />
                <span className="ILink_decoration ILink_decoration_left">[[</span>
                <span className="ILink_decoration ILink_decoration_value"> {sharedNode?.path}</span>
                <span className="ILink_decoration ILink_decoration_right">]]</span>
              </SILink>
            </EditorPreview>
          ),
          [NodeType.ARCHIVED]: <ArchivedNode selected={selected} archivedNode={archivedNode} />,
          [NodeType.DEFAULT]: (
            <EditorPreview
              placement="auto"
              preview={preview}
              nodeid={element.value}
              allowClosePreview
              content={content}
              setPreview={setPreview}
            >
              <SILink $selected={selected} onClick={onClickProps}>
                <span className="ILink_decoration ILink_decoration_left">[[</span>
                <span className="ILink_decoration ILink_decoration_value">
                  {' '}
                  {!content ? path : `${path} : ${element.blockValue}`}{' '}
                </span>
                <span className="ILink_decoration ILink_decoration_right">]]</span>
              </SILink>
            </EditorPreview>
          ),
          [NodeType.MISSING]: <MissingNode selected={selected} />
        }[nodeType]
      }
      {children}
    </SILinkRoot>
  )
}
