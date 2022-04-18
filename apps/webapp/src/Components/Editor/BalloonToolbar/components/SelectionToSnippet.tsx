import { ToolbarButton, ToolbarButtonProps } from '@udecode/plate'
import { getPreventDefaultHandler, usePlateEditorState } from '@udecode/plate-core'
import React from 'react'
import { useTransform } from './useTransform'

/**
 * Toolbar button to Create new note from editor selection
 */
export const SelectionToSnippet = ({ ...props }: ToolbarButtonProps) => {
  const editor = usePlateEditorState()!
  const { selectionToSnippet, isConvertable } = useTransform()

  return (
    <ToolbarButton
      disabled={!!editor?.selection && isConvertable(editor)}
      onMouseDown={
        !!editor?.selection && isConvertable(editor) ? getPreventDefaultHandler(selectionToSnippet, editor) : undefined
      }
      // Fade out when sync is selected
      styles={{ root: { opacity: !!editor?.selection && isConvertable(editor) ? 1 : 0.25 } }}
      {...props}
    />
  )
}
