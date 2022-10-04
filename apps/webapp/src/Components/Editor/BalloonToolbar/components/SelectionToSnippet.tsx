import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { BalloonToolbarInputWrapper, useBalloonToolbarStore, Input } from '@mexit/shared'
import { ToolbarButton, ToolbarButtonProps } from '@udecode/plate'
import { getPreventDefaultHandler, usePlateEditorState } from '@udecode/plate-core'
import React, { useEffect } from 'react'
import { useTransform } from './useTransform'
import { Icon } from '@iconify/react'

/**
 * Toolbar button to Create new note from editor selection
 */
export const SelectionToSnippet = ({ ...props }: ToolbarButtonProps) => {
  const editor = usePlateEditorState()!
  const { isConvertable } = useTransform()
  const setToolbarState = useBalloonToolbarStore((s) => s.setToolbarState)

  return (
    <ToolbarButton
      disabled={!!editor?.selection && isConvertable(editor)}
      onMouseDown={
        !!editor?.selection && isConvertable(editor)
          ? getPreventDefaultHandler(() => setToolbarState('new-snippet'))
          : undefined
      }
      // Fade out when sync is selected
      styles={{ root: { opacity: !!editor?.selection && isConvertable(editor) ? 1 : 0.25 } }}
      {...props}
    />
  )
}

export const SelectionToSnippetInput = () => {
  const editor = usePlateEditorState()!
  const setOpen = useBalloonToolbarStore((s) => s.setOpen)
  const { selectionToSnippet, isConvertable } = useTransform()

  const inputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }, 1)
    return () => clearTimeout(timeoutId)
  }, [inputRef])

  return (
    <BalloonToolbarInputWrapper>
      <Icon icon={quillPenLine} />
      <Input
        ref={inputRef}
        placeholder="Snippet title"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (!!editor?.selection && isConvertable(editor)) {
              const inputVal = e.currentTarget?.value
              // console.log('We got that val', { inputVal })
              if (inputVal !== '') {
                selectionToSnippet(editor, inputVal ?? undefined)
              } else selectionToSnippet(editor)
            }
            setOpen(false)
          }
          if (e.key === 'Escape') {
            setOpen(false)
            // setToolbarState('normal')
          }
        }}
      />
    </BalloonToolbarInputWrapper>
  )
}

