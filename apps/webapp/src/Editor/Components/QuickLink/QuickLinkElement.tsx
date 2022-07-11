import React, { useState } from 'react'
import { Transforms } from 'slate'
import { useReadOnly, useFocused, useSelected } from 'slate-react'
import shareLine from '@iconify/icons-ri/share-line'
import archivedIcon from '@iconify/icons-ri/archive-line'
import eyeOffLine from '@iconify/icons-ri/eye-off-line'
import { useEditorRef } from '@udecode/plate'

import { ILink, mog, NodeType, SharedNode } from '@mexit/core'
import { SILinkRoot, SILink, StyledIcon, SharedNodeIcon } from '@mexit/shared'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../../Hooks/useRouting'
import { useNavigation } from '../../../Hooks/useNavigation'
import useArchive from '../../../Hooks/useArchive'
import { useHotkeys } from '../../../Hooks/useHotkeys'
import { useLinks } from '../../../Hooks/useLinks'
import { useNodes } from '../../../Hooks/useNodes'
import { useOnMouseClick } from '../../../Hooks/useOnMouseClick'

import { ILinkElementProps } from '../../Types/QuickLink'
import EditorPreview from '../EditorPreview/EditorPreview'
import { getBlock } from '../../../Utils/parseData'

const SharedNodeLink = ({ selected, sharedNode }: { selected: boolean; sharedNode: SharedNode }) => {
  return (
    <SILink $selected={selected}>
      <StyledIcon icon={shareLine} />
      <span className="ILink_decoration ILink_decoration_left">[[</span>
      <span className="ILink_decoration ILink_decoration_value"> {sharedNode?.path}</span>
      <span className="ILink_decoration ILink_decoration_right">]]</span>
    </SILink>
  )
}

const ArchivedNode = ({ selected, archivedNode }: { selected: boolean; archivedNode: ILink }) => {
  return (
    <SILink $selected={selected} color="#df7777" $archived={true}>
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
  // mog('We reached here', { selected, focused })

  // const nodeid = getNodeidFromPath(element.value)
  const readOnly = useReadOnly()
  const path = getPathFromNodeid(element.value)
  const { archived } = useArchive()
  const { goTo } = useRouting()

  const onClickProps = useOnMouseClick(() => {
    // Show preview on click, if preview is shown, navigate to link
    if (!preview) {
      setPreview(true)
    } else {
      push(element.value)
      goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
    }
  })

  // useEffect(() => {
  //   // If the preview is shown and the element losses focus --> Editor focus is moved
  //   // Hide the preview
  //   if (preview && !selected) setPreview(false)
  // }, [selected])

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor)
      }
    },
    [element]
  )

  useHotkeys(
    'enter',
    () => {
      // mog('Enter the dragon', { selected, preview, focused, esl: editor.selection })
      // Show preview on Enter, if preview is shown, navigate to link
      if (selected && focused && editor.selection) {
        if (!preview) setPreview(true)
      }
      // Once preview is shown the link looses focus
      if (preview) {
        mog('working', { element })
        push(element.value)
        goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
      }
    },
    [selected, preview]
  )
  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor, { reverse: true })
      }
    },
    [selected, focused]
  )
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
        // The key to the temporary object defines what to render
        {
          [NodeType.SHARED]: <SharedNodeLink selected={selected} sharedNode={sharedNode} />,
          [NodeType.ARCHIVED]: <ArchivedNode selected={selected} archivedNode={archivedNode} />,
          [NodeType.DEFAULT]: (
            <EditorPreview
              placement="auto"
              allowClosePreview={readOnly}
              preview={preview}
              nodeid={element.value}
              content={content}
              closePreview={() => setPreview(false)}
            >
              <SILink $selected={selected} {...onClickProps}>
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
