import { useEffect, useState } from 'react'

import {
  getSelectionText,
  isSelectionExpanded,
  mergeProps,
  useEditorState,
  useEventEditorSelectors
} from '@udecode/plate-core'
import {
  flip,
  getSelectionBoundingClientRect,
  offset,
  shift,
  useVirtualFloating,
  UseVirtualFloatingOptions,
  UseVirtualFloatingReturn
} from '@udecode/plate-floating'
import { useFocused } from 'slate-react'
import create from 'zustand'

type ToolbarState = 'normal' | 'new-note' | 'new-snippet'

interface BalloonToolbarStore {
  open: boolean
  setOpen: (open: boolean) => void
  toolbarState: ToolbarState
  setToolbarState: (state: ToolbarState) => void
}

export const useBalloonToolbarStore = create<BalloonToolbarStore>((set, get) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toolbarState: 'normal',
  setToolbarState: (state) => set({ toolbarState: state })
}))

export const useFloatingToolbar = ({
  floatingOptions
}: {
  floatingOptions?: UseVirtualFloatingOptions
} = {}): UseVirtualFloatingReturn & {
  open: boolean
} => {
  const focusedEditorId = useEventEditorSelectors.focus()
  const editor = useEditorState()
  const focused = useFocused()
  const toolbarState = useBalloonToolbarStore((s) => s.toolbarState)
  const setToolbarState = useBalloonToolbarStore((s) => s.setToolbarState)

  const [waitForCollapsedSelection, setWaitForCollapsedSelection] = useState(false)

  // const [open, setOpen] = useState(false)
  const open = useBalloonToolbarStore((s) => s.open)
  const setOpen = useBalloonToolbarStore((s) => s.setOpen)

  const selectionExpanded = editor && isSelectionExpanded(editor)
  const selectionText = editor && getSelectionText(editor)

  // On refocus, the editor keeps the previous selection,
  // so we need to wait it's collapsed at the new position before displaying the floating toolbar.
  useEffect(() => {
    if (!focused) {
      setWaitForCollapsedSelection(true)
    }

    if (!selectionExpanded) {
      setWaitForCollapsedSelection(false)
    }
  }, [focused, selectionExpanded])

  useEffect(() => {
    if ((!selectionExpanded || !selectionText || editor.id !== focusedEditorId) && toolbarState === 'normal') {
      setOpen(false)
    } else if (toolbarState !== 'normal' && editor.id === focusedEditorId) {
      setOpen(false)
    } else if (selectionText && selectionExpanded && !waitForCollapsedSelection) {
      setOpen(true)
    }
  }, [editor.id, editor.selection, focusedEditorId, selectionExpanded, selectionText, waitForCollapsedSelection])

  const floatingResult = useVirtualFloating(
    mergeProps(
      {
        middleware: [
          offset(12),
          shift(),
          flip({
            padding: 150
          })
        ],
        placement: 'top',
        getBoundingClientRect: getSelectionBoundingClientRect,
        open,
        onOpenChange: setOpen
      },
      floatingOptions
    )
  )

  const { update } = floatingResult

  const selectionTextLength = selectionText?.length ?? 0

  useEffect(() => {
    if (!open) {
      setToolbarState('normal')
    }
  }, [open])

  useEffect(() => {
    if (selectionTextLength > 0) {
      update?.()
    }
  }, [selectionTextLength, update])

  return { ...floatingResult, open }
}
