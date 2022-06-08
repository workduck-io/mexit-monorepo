import { Icon } from '@iconify/react'
import { useEditorRef } from '@udecode/plate'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import styled from 'styled-components'
import { useHotkeys } from '../../../hooks/useHotKeys'
import { SILink, SILinkRoot } from './QuickLinkElement.styles'
import { ILinkProps } from './QuickLink.types'
import React from 'react'
import { useLinks } from '../../../../Hooks/useLinks'
import { getBlock } from '../../../../Utils/parseData'

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
  const { getPathFromNodeid } = useLinks()

  const path = getPathFromNodeid(element.value)
  const block = element.blockId ? getBlock(element.value, element.blockId) : undefined
  const content = block ? [block] : undefined

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
        // TODO: uncomment this when the id from address bar issue is fixed in webapp
        // <EditorPreview
        //   isPreview={isPreview(editor.id)}
        //   previewRef={editor}
        //   nodeid={nodeid}
        // >
        <SILink focused={selected}>
          <span className="ILink_decoration ILink_decoration_left">[[</span>
          <span className="ILink_decoration ILink_decoration_value">
            {' '}
            {!content ? path : `${path} : ${element.blockValue}`}{' '}
          </span>
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
