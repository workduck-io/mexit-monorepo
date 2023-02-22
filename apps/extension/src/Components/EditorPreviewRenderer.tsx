import React, { useMemo } from 'react'

import { Plate, PlatePlugin } from '@udecode/plate'
import styled from 'styled-components'

import { BodyFont, EditorStyles, FadeContainer, TodoContainer } from '@mexit/shared'

import { useMemoizedPlugins } from '../Editor/plugins'

import { editorPreviewComponents } from './Editor/EditorPreviewComponents'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  noStyle?: boolean
  /**
   * Block that will be focused on render
   */
  blockId?: string
  readOnly?: boolean
  noMouseEvents?: boolean
  onDoubleClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  plugins?: PlatePlugin[]
}

const PreviewStyles = styled(EditorStyles)<{ noMouseEvents: boolean }>`
  ${({ noMouseEvents }) => noMouseEvents && 'pointer-events: none;'};
  ${BodyFont}
  overflow-y: auto;
  ${TodoContainer}, button,
  input,
  textarea,
  select,
  option {
    pointer-events: none;
  }
`

const EditorPreviewRenderer = ({
  content,
  editorId,
  blockId,
  readOnly = false,
  noStyle,
  noMouseEvents,
  onDoubleClick
}: EditorPreviewRendererProps) => {
  const editableProps = useMemo(
    () => ({
      placeholder: 'Murmuring the mex hype... ',
      spellCheck: !readOnly,
      style: noStyle
        ? {}
        : {
            padding: '15px'
          },
      readOnly,
      autoFocus: !readOnly
    }),
    [readOnly]
  )

  // We get memoized plugins
  const plugins = useMemoizedPlugins(editorPreviewComponents, { exclude: { dnd: true } })

  // useEditorChange(editorId, content)

  console.log('EDITORPREVIEW CONTENT', { editorId, content })

  return (
    <PreviewStyles
      noMouseEvents={noMouseEvents}
      onClick={(ev) => {
        if (onDoubleClick && ev.detail === 2) {
          onDoubleClick(ev)
        }
      }}
    >
      <FadeContainer fade={blockId !== undefined}>
        <Plate id={editorId} editableProps={editableProps} value={content} plugins={plugins} />
      </FadeContainer>
    </PreviewStyles>
  )
}
export default EditorPreviewRenderer
