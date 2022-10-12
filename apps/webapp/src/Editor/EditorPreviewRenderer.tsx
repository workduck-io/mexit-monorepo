import React, { useEffect, useMemo } from 'react'

import { Plate, PlatePlugin } from '@udecode/plate'
import { debounce } from 'lodash'
import { transparentize } from 'polished'
import { useContextMenu } from 'react-contexify'
import { ErrorBoundary } from 'react-error-boundary'
import styled, { css } from 'styled-components'

import { NodeEditorContent } from '@mexit/core'
import { EditorStyles, FadeContainer, TodoContainer } from '@mexit/shared'

import { useBlockHighlightStore, useFocusBlock } from '../Stores/useFocusBlock'
import { MENU_ID } from './Components/BlockContextMenu'
import components, { editorPreviewComponents } from './Components/EditorPreviewComponents'
import { MultiComboboxContainer } from './Components/MultiCombobox/multiComboboxContainer'
import useMultiComboboxOnChange from './Components/MultiCombobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from './Components/MultiCombobox/useMultiComboboxOnKeyDown'
import { useEditorPluginConfig } from './Hooks/useEditorConfig'
import generatePlugins from './Plugins'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  noStyle?: boolean
  onChange?: (val: NodeEditorContent) => void
  /**
   * Block that will be focused on render
   */
  blockId?: string
  noMouseEvents?: boolean
  onDoubleClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  plugins?: PlatePlugin[]
  readOnly?: boolean
  draftView?: boolean
}

const PreviewStyles = styled(EditorStyles)<{ draftView?: boolean; readOnly?: boolean }>`
  ${({ draftView }) =>
    draftView &&
    css`
      * {
        font-size: 0.9rem !important;
      }
    `}

  ${({ readOnly }) =>
    readOnly &&
    css`
      ${TodoContainer}, button, input, textarea, select, option {
        pointer-events: none;
      }
    `}
  overflow: hidden;

  .slate-highlight {
    background-color: ${(props) => transparentize(0.75, props.theme.colors.primary)};
    color: ${(props) => props.theme.colors.text.default};
    transition: all 0.3s ease-in-out;
  }
`

const EditorPreviewRenderer = ({
  content,
  editorId,
  blockId,
  noStyle,
  noMouseEvents,
  onChange,
  onDoubleClick,
  readOnly = true,
  draftView = true
}: EditorPreviewRendererProps) => {
  const editableProps = useMemo(
    () => ({
      placeholder: 'Murmuring the mex hype... ',
      style: noStyle
        ? {}
        : {
            padding: '15px'
          },
      readOnly,
      spellCheck: false,
      autoFocus: !readOnly
    }),
    [readOnly]
  )

  // We get memoized plugins
  const oldPlugins = useMemo(
    () => generatePlugins(readOnly ? editorPreviewComponents : components, { exclude: { dnd: true } }),
    [readOnly]
  )

  const comboboxConfig = useEditorPluginConfig(editorId, { exclude: { dnd: true } })
  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(editorId, comboboxConfig.onChangeConfig),
      onKeyDown: useMultiComboboxOnKeyDown(comboboxConfig.onKeyDownConfig)
    }
  }

  const { show } = useContextMenu({ id: MENU_ID })
  const plugins = [
    ...oldPlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onContextMenu: () => (ev) => {
          show(ev)
        },
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  // We get memoized plugins
  const setHighlights = useBlockHighlightStore((s) => s.setHighlightedBlockIds)
  const { focusBlock } = useFocusBlock()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (blockId) {
        focusBlock(blockId, editorId)
        setHighlights([blockId], 'preview')
      }
    }, 300)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [blockId, editorId])

  // useEditorChange(editorId, content)

  const onDelayPerform = debounce(!readOnly && typeof onChange === 'function' ? onChange : () => undefined, 200)

  const onContentChange = (val: NodeEditorContent) => {
    if (onChange) onDelayPerform(val)
  }

  return (
    <ErrorBoundary fallbackRender={() => <></>}>
      <PreviewStyles
        readOnly={noMouseEvents && readOnly}
        draftView={draftView}
        onClick={(ev) => {
          if (onDoubleClick && ev.detail === 2) {
            onDoubleClick(ev)
          }
        }}
      >
        <FadeContainer fade={blockId !== undefined}>
          <Plate
            id={editorId}
            editableProps={editableProps}
            onChange={onContentChange}
            initialValue={content}
            plugins={plugins}
          >
            {!readOnly && <MultiComboboxContainer config={comboboxConfig.onKeyDownConfig} />}
          </Plate>
        </FadeContainer>
      </PreviewStyles>
    </ErrorBoundary>
  )
}

export default EditorPreviewRenderer
