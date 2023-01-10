import React, { useEffect } from 'react'

import styled, { css } from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import { NodeEditorContent } from '@mexit/core'
import { EditorStyles, useEditorChange } from '@mexit/shared'

import components from '../../Editor/Components/EditorPreviewComponents'
import { useEditorPluginConfig } from '../../Editor/Hooks/useEditorConfig'
import MexEditor, { MexEditorOptions } from '../../Editor/MexEditor'
import { ComboboxConfig } from '../../Editor/Types/MultiCombobox'
import { useFocusBlock } from '../../Stores/useFocusBlock'

import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'

const EditorWrapper = styled(EditorStyles)<{ withShadow?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 800px;
  padding: 1rem;
  padding-left: 2rem;
  min-height: 100%;

  transition: background 0.5s ease-in-out;

  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${({ withShadow, theme }) =>
    withShadow
      ? css`
          box-shadow: ${theme.tokens.shadow.medium};
          background-color: rgba(${theme.rgbTokens.surfaces.s[2]}, 0.5);
        `
      : css`
          &:hover {
            background-color: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[0]}, 0.5);
          }
          &:focus-within {
            &:hover {
              background-color: transparent;
            }
          }
        `}
`

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  nodePath?: string
  nodeUID: string
  readOnly?: boolean
  includeBlockInfo?: boolean
  focusBlockId?: string // * Block to focus, This uses a timeout as immediately the children are not rendered yet
  onChange?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  autoFocus?: boolean
  onFocusClick?: () => void
  withShadow?: boolean
  options?: any
  onAutoSave?: (content: NodeEditorContent) => void
}

const Editor: React.FC<EditorProps> = ({
  nodeUID,
  nodePath,
  content,
  readOnly,
  onChange,
  focusBlockId,
  autoFocus = true,
  includeBlockInfo = false,
  onAutoSave,
  onFocusClick,
  withShadow = false,
  options
}) => {
  useEditorChange(nodeUID, content)
  const { focusBlock } = useFocusBlock()

  useEffect(() => {
    if (focusBlockId) {
      const timoutId = setTimeout(() => {
        focusBlock(focusBlockId, nodeUID)
      }, 1000)
      return () => clearTimeout(timoutId)
    }
  }, [focusBlockId, nodeUID])

  const editorOptions: MexEditorOptions = {
    editableProps: {
      spellCheck: false,
      readOnly,
      // placeholder: "Let's try something here...",
      autoFocus
    },
    focusOptions: options?.focusOptions ?? {
      edge: 'start',
      focus: true
    },
    withDraggable: false,
    withBalloonToolbar: true
  }

  const onDelayPerform = useDebouncedCallback((value) => {
    const f = !readOnly && typeof onChange === 'function' ? onChange : () => undefined
    f(value)
  }, 200)

  const saveAfterDelay = useDebouncedCallback(
    typeof onAutoSave === 'function' ? onAutoSave : () => undefined,
    30 * 1000 // After 30 seconds
  )

  const onChangeContent = (val: NodeEditorContent) => {
    onDelayPerform(val)

    if (onAutoSave) {
      saveAfterDelay.cancel()
      saveAfterDelay(val)
    }
  }

  const comboboxConfig: ComboboxConfig = useEditorPluginConfig(nodeUID)

  return (
    <EditorWrapper withShadow={withShadow}>
      <MexEditor
        comboboxConfig={comboboxConfig}
        components={components}
        meta={{
          path: nodePath
        }}
        BalloonMarkToolbarButtons={<BallonMarkToolbarButtons />}
        onChange={onChangeContent}
        options={editorOptions}
        editorId={nodeUID}
        value={content}
        pluginOptions={{
          include: {
            blockModifier: includeBlockInfo
          }
        }}
      />
      {!readOnly && onFocusClick && <div onClick={onFocusClick} style={{ flexShrink: 1, flexGrow: 1 }} />}
    </EditorWrapper>
  )
}

export default Editor
