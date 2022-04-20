import { ToolbarButton, ToolbarButtonProps } from '@udecode/plate'
import { getPreventDefaultHandler, usePlateEditorState } from '@udecode/plate-core'
import React from 'react'
import { useTransform } from './useTransform'

/**
 * Toolbar button to Create new note from editor selection
 */
export const SelectionToNode = ({ ...props }: ToolbarButtonProps) => {
  const editor = usePlateEditorState()!
  const { selectionToNode, isConvertable } = useTransform()

  return (
    <ToolbarButton
      disabled={!!editor?.selection && isConvertable(editor)}
      onMouseDown={
        !!editor?.selection && isConvertable(editor) ? getPreventDefaultHandler(selectionToNode, editor) : undefined
      }
      // Fade out when sync is selected
      styles={{ root: { opacity: !!editor?.selection && isConvertable(editor) ? 1 : 0.25 } }}
      {...props}
    />
  )
}
