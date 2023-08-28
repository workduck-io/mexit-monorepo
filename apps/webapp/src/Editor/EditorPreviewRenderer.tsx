import React, { useEffect, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { Plate, PlatePlugin } from '@udecode/plate'
import { debounce } from 'lodash'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

import { ContextMenuType, NodeEditorContent, useBlockHighlightStore, useLayoutStore } from '@mexit/core'
import { EditorStyles, TodoContainer, useFocusBlock } from '@mexit/shared'

import components, { editorPreviewComponents } from './Components/EditorPreviewComponents'
import { MultiComboboxContainer } from './Components/MultiCombobox/multiComboboxContainer'
import useMultiComboboxOnChange from './Components/MultiCombobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from './Components/MultiCombobox/useMultiComboboxOnKeyDown'
import { useEditorPluginConfig } from './Hooks/useEditorConfig'
import { generateEditorPluginsWithComponents } from './Plugins'

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
  placeholder?: string
}

const PreviewStyles = styled(EditorStyles)<{ draftView?: boolean; readOnly?: boolean }>`
  ${({ draftView }) =>
    draftView &&
    css`
      * {
        font-size: 0.9rem !important;
      }
      width: 100%;
    `}

  ${({ readOnly }) =>
    readOnly &&
    css`
      padding: 0;

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
  draftView = true,
  placeholder
}: EditorPreviewRendererProps) => {
  const setContextMenu = useLayoutStore((store) => store.setContextMenu)

  const editableProps = useMemo(
    () => ({
      placeholder: placeholder ?? 'Murmuring the mex hype... ',
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
    () =>
      generateEditorPluginsWithComponents(readOnly ? editorPreviewComponents : components, { exclude: { dnd: true } }),
    [readOnly]
  )

  const comboboxConfig = useEditorPluginConfig(editorId, { exclude: { dnd: true } })
  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(editorId, comboboxConfig.onChangeConfig),
      onKeyDown: useMultiComboboxOnKeyDown(comboboxConfig.onKeyDownConfig)
    }
  }

  const plugins = [
    ...oldPlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onContextMenu: () => (ev) => {
          ev.preventDefault()
          setContextMenu({
            type: ContextMenuType.NOTES_TREE,
            item: undefined,
            coords: {
              x: ev.clientX,
              y: ev.clientY
            }
          })
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
    <PreviewStyles
      readOnly={noMouseEvents && readOnly}
      draftView={draftView}
      onClick={(ev) => {
        if (onDoubleClick && ev.detail === 2) {
          onDoubleClick(ev)
        }
      }}
    >
      <ErrorBoundary fallbackRender={() => <></>}>
        <Plate
          id={editorId}
          editableProps={editableProps}
          onChange={onContentChange}
          initialValue={content}
          plugins={plugins}
        >
          {!readOnly && <MultiComboboxContainer config={comboboxConfig.onKeyDownConfig} />}
        </Plate>
      </ErrorBoundary>
    </PreviewStyles>
  )
}

export default EditorPreviewRenderer
