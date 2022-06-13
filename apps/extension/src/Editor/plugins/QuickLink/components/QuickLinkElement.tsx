import { Icon } from '@iconify/react'
import archivedIcon from '@iconify/icons-ri/archive-line'
import { useEditorRef } from '@udecode/plate'
import { Transforms } from 'slate'
import { useFocused, useSelected, useReadOnly } from 'slate-react'
import styled from 'styled-components'
import { useHotkeys } from '../../../hooks/useHotKeys'
import { SILink, SILinkRoot } from '@mexit/shared'
import { ILinkElementProps, ILinkProps } from './QuickLink.types'
import React, { useState } from 'react'
import { useLinks } from '../../../../Hooks/useLinks'
import { getBlock } from '../../../../Utils/parseData'
import EditorPreview from '../../../../Components/Editor/EditorPreview'
import { useNodes } from '../../../../Hooks/useNodes'
import { mog } from '@mexit/core'
import { useOnMouseClick } from '../../../hooks/useOnMouseClick'

const StyledIcon = styled(Icon)`
  margin-right: 4px;
`

export const QuickLinkElement = ({ attributes, children, element }: ILinkElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const [preview, setPreview] = useState(false)
  // const { push } = useNavigation()
  const { getPathFromNodeid } = useLinks()
  const { getArchiveNode } = useNodes()
  // mog('We reached here', { selected, focused })

  // const nodeid = getNodeidFromPath(element.value)
  const readOnly = useReadOnly()
  const path = getPathFromNodeid(element.value)
  // const { archived } = useArchive()
  // const { goTo } = useRouting()

  const onClickProps = useOnMouseClick(() => {
    // Show preview on click, if preview is shown, navigate to link
    if (!preview) {
      setPreview(true)
    } else {
      mog('pushing', { id: element.value })
      // push(element.value)
      // goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
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
        // push(element.value)
        // goTo(ROUTE_PATHS.node, NavigationType.push, element.value)
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
  // const isArchived = archived(element.value)
  const block = element.blockId ? getBlock(element.value, element.blockId) : undefined
  const content = block ? [block] : undefined
  // const archivedNode = isArchived ? getArchiveNode(element.value) : undefined

  console.log({ path, element })

  return (
    <SILinkRoot
      {...attributes}
      id={`ILINK_${element.value}`}
      data-tour="mex-onboarding-ilink"
      data-slate-value={element.value}
      contentEditable={false}
    >
      {false ? (
        <SILink $selected={selected} $archived={true}>
          <StyledIcon icon={archivedIcon} color="#df7777" />
          <span className="ILink_decoration ILink_decoration_left">[[</span>
          {/* <span className="ILink_decoration ILink_decoration_value"> {archivedNode?.path}</span> */}
          <span className="ILink_decoration ILink_decoration_right">]]</span>
        </SILink>
      ) : (
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
      )}
      {children}
    </SILinkRoot>
  )
}
