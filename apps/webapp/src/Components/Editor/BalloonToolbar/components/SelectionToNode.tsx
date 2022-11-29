import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import { BalloonToolbarInputWrapper, Input,useBalloonToolbarStore } from '@mexit/shared'
import { ToolbarButton, ToolbarButtonProps } from '@udecode/plate'
import { getPreventDefaultHandler, usePlateEditorState } from '@udecode/plate-core'
import React, { useEffect } from 'react'

import { useTransform } from './useTransform'
// import { Input } from '@style/Form'

/**
 * Toolbar button to Create new note from editor selection
 */
export const SelectionToNode = ({ ...props }: ToolbarButtonProps) => {
  const editor = usePlateEditorState()!
  const { isConvertable } = useTransform()
  const setToolbarState = useBalloonToolbarStore((s) => s.setToolbarState)

  return (
    <ToolbarButton
      disabled={!!editor?.selection && isConvertable(editor)}
      onMouseDown={
        !!editor?.selection && isConvertable(editor)
          ? getPreventDefaultHandler(() => setToolbarState('new-note'))
          : undefined
      }
      // Fade out when sync is selected
      styles={{ root: { opacity: !!editor?.selection && isConvertable(editor) ? 1 : 0.25 } }}
      {...props}
    />
  )
}

export const SelectionToNodeInput = () => {
  const editor = usePlateEditorState()!
  const setOpen = useBalloonToolbarStore((s) => s.setOpen)
  const { selectionToNode, isConvertable } = useTransform()

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
      <Icon icon={fileList2Line} />
      <Input
        ref={inputRef}
        placeholder="Child Note title"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (!!editor?.selection && isConvertable(editor)) {
              const inputVal = e.currentTarget?.value
              // console.log('We got that val', { inputVal })
              if (inputVal !== '') {
                selectionToNode(editor, inputVal ?? undefined)
              } else selectionToNode(editor)
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
