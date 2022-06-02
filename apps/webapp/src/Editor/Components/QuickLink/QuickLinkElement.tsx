import React from 'react'
import { Icon } from '@iconify/react'
import { useEditorRef } from '@udecode/plate'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import styled from 'styled-components'

import { ILinkProps } from '../../Types/QuickLink'
import { SILinkRoot, SILink } from '../../Styles/QuickLinkElement'
import { useHotkeys } from '../../../Hooks/useHotkeys'

const StyledIcon = styled(Icon)`
  margin-right: 4px;
`

const QuickLinkElement = ({
  attributes,
  children,
  element,
  isArchived,
  nodeid,
  onClick,
  showPreview,
  archivedIcon
}: ILinkProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor)
      }
    },
    [selected, focused]
  )

  // const onClickProps = useOnMouseClick(() => {
  //   onClick();
  // });

  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor, { reverse: true })
      }
    },
    [selected, focused]
  )

  return (
    <SILinkRoot
      {...attributes}
      id={`ILINK_${element.value}`}
      data-slate-value={element.value}
      contentEditable={false}
      onClick={onClick}
    >
      {isArchived ? (
        <SILink focused={selected} archived={true}>
          <StyledIcon icon={archivedIcon} color="#df7777" />
          <span className="ILink_decoration ILink_decoration_left">[[</span>
          <span className="ILink_decoration ILink_decoration_value"> {element.value}</span>
          <span className="ILink_decoration ILink_decoration_right">]]</span>
        </SILink>
      ) : (
        // <EditorPreview
        //   isPreview={isPreview(editor.id)}
        //   previewRef={editor}
        //   nodeid={nodeid}
        // >
        <SILink focused={selected}>
          <span className="ILink_decoration ILink_decoration_left">[[</span>
          <span className="ILink_decoration ILink_decoration_value"> {element.value}</span>
          <span className="ILink_decoration ILink_decoration_right">]]</span>
        </SILink>
        // </EditorPreview>
      )}
      {children}
    </SILinkRoot>
  )
}

export default QuickLinkElement

const isPreview = (id: string) => id.startsWith('__preview__')
