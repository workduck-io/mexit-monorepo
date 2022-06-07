import React, { useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { EditorStyles, FadeContainer, TodoContainer } from '@mexit/shared'

import { useBlockHighlightStore, useFocusBlock } from '../Stores/useFocusBlock'
import { useEditorChange } from '@mexit/shared'
import { editorPreviewComponents } from './Components/EditorPreviewComponents'

import { Plate, PlatePlugin } from '@udecode/plate'
import useMemoizedPlugins from './Plugins'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  noStyle?: boolean
  /**
   * Block that will be focused on render
   */
  blockId?: string
  noMouseEvents?: boolean
  onDoubleClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  plugins?: PlatePlugin[]
}

const PreviewStyles = styled(EditorStyles)<{ noMouseEvents: boolean }>`
  ${({ noMouseEvents }) => noMouseEvents && 'pointer-events: none;'};
  /* user-select: none; */
  font-size: 0.9rem;

  ${TodoContainer}, button, input, textarea, select, option {
    pointer-events: none;
  }
`

const EditorPreviewRenderer = ({
  content,
  editorId,
  blockId,
  noStyle,
  noMouseEvents,
  onDoubleClick
}: EditorPreviewRendererProps) => {
  const editableProps = {
    placeholder: 'Murmuring the mex hype... ',
    spellCheck: false,
    style: noStyle
      ? {}
      : {
          padding: '15px'
        },
    readOnly: true
  }

  // We get memoized plugins
  const plugins = useMemoizedPlugins(editorPreviewComponents, { exclude: { dnd: true } })
  const setHighlights = useBlockHighlightStore((s) => s.setHighlightedBlockIds)
  const { focusBlock } = useFocusBlock()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blockId) {
        // mog('editorPreviewRenderer', { blockId, editorId })
        focusBlock(blockId, editorId)
        setHighlights([blockId], 'preview')
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [blockId, editorId, content])

  useEditorChange(editorId, content)

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
