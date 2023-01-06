import React, { useEffect } from 'react'

import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'

import { NodeEditorContent } from '@mexit/core'
import { EditorStyles, useEditorChange } from '@mexit/shared'

import components from '../../Editor/Components/EditorPreviewComponents'
import { useEditorPluginConfig } from '../../Editor/Hooks/useEditorConfig'
import MexEditor, { MexEditorOptions } from '../../Editor/MexEditor'
import { ComboboxConfig } from '../../Editor/Types/MultiCombobox'
import { useFocusBlock } from '../../Stores/useFocusBlock'

import BallonMarkToolbarButtons from './BalloonToolbar/EditorBalloonToolbar'

const EditorWrapper = styled(EditorStyles)`
  flex: 1;
  max-width: 800px;
  padding: 1rem;
  padding-left: 2rem;
  height: 100%;

  transition: background 0.5s ease-in-out;

  &:hover {
    background-color: rgba(${({ theme }) => theme.rgbTokens.surfaces.s[0]}, 0.5);
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:focus-within {
    &:hover {
      background-color: transparent;
    }
  }
`

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  nodePath?: string
  nodeUID: string
  readOnly?: boolean
  includeBlockInfo?: boolean
  focusBlockId?: string // * Block to focus
  onChange?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  autoFocus?: boolean
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
  options
}) => {
  useEditorChange(nodeUID, content)
  const { focusBlock } = useFocusBlock()

  useEffect(() => {
    if (focusBlockId) {
      focusBlock(focusBlockId, nodeUID)
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
    <EditorWrapper>
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
    </EditorWrapper>
  )
}

export default Editor
