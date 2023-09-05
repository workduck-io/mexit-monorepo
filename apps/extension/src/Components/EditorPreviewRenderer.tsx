import React, { useMemo } from 'react'

import { Plate, PlatePlugin } from '@udecode/plate'
import styled, { css } from 'styled-components'

import { BodyFont, EditorStyles, TodoContainer } from '@mexit/shared'

import { useMemoizedPlugins } from '../Editor/plugins'

import { editorPreviewComponents } from './Editor/EditorPreviewComponents'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  noStyle?: boolean
  /**
   * Block that will be focused on render
   */
  flex?: boolean
  blockId?: string
  readOnly?: boolean
  noMouseEvents?: boolean
  onDoubleClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  plugins?: PlatePlugin[]
}

const PreviewStyles = styled(EditorStyles)<{ noMouseEvents: boolean; readOnly?: boolean }>`
  ${({ noMouseEvents }) => noMouseEvents && 'pointer-events: none;'};

  ${BodyFont}
  overflow-y: auto;

  ${({ readOnly = false }) =>
    readOnly &&
    css`
      ${TodoContainer}, button,
  input,
  textarea,
  select,
  option {
        pointer-events: none;
      }
    `}
`

const EditorPreviewRenderer = ({
  content,
  editorId,
  blockId,
  readOnly = false,
  noStyle,
  flex,
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
  return <Plate id={editorId} editableProps={editableProps} value={content} plugins={plugins} />

  return (
    <PreviewStyles
      noMouseEvents={noMouseEvents}
      onClick={(ev) => {
        if (onDoubleClick && ev.detail === 2) {
          onDoubleClick(ev)
        }
      }}
    >
      {/* <FadeContainer flex={flex} fade={blockId !== undefined}> */}
      {/* </FadeContainer> */}
    </PreviewStyles>
  )
}
export default EditorPreviewRenderer
