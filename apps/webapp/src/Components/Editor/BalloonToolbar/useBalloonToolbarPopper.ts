import { useCallback, useEffect } from 'react'
import { getSelectionText, getText, isSelectionExpanded, useEditorState } from '@udecode/plate-core'
import { getSelectionBoundingClientRect, usePopperPosition, UsePopperPositionOptions } from '@udecode/plate-ui-popper'
import { useFocused } from 'slate-react'
import { clearBlurSelection, isBlurSelection } from '../../../Utils/blurSelection'
import tinykeys from 'tinykeys'
import create from 'zustand'

interface BalloonToolbarStore {
  isHidden: boolean
  setIsHidden: (isHidden: boolean) => void
  isFocused: boolean
  setIsFocused: (isFocused: boolean) => void
}

export const useBalloonToolbarStore = create<BalloonToolbarStore>((set, get) => ({
  isHidden: true,
  setIsHidden: (isHidden) => set({ isHidden }),
  isFocused: false,
  setIsFocused: (isFocused) => set({ isFocused })
}))

export const useBalloonToolbarPopper = (options: UsePopperPositionOptions) => {
  const editor = useEditorState()
  const focused = useFocused()

  const isHidden = useBalloonToolbarStore((s) => s.isHidden)
  const setIsHidden = useBalloonToolbarStore((s) => s.setIsHidden)
  const isBalloonFocused = useBalloonToolbarStore((s) => s.isFocused)

  const selectionExpanded = editor && isSelectionExpanded(editor)
  const selectionText = editor && getSelectionText(editor)
  const blurSelection = editor && isBlurSelection(editor as any)
  // const blurSelectionText = editor && getText(editor, editor.blurSelection)

  const show = useCallback(() => {
    // mog('Balloon show laddies', { selectionText, selectionExpanded, blurSelection })
    if (isHidden && selectionExpanded) {
      setIsHidden(false)
    }
  }, [isHidden, selectionExpanded])

  useEffect(() => {
    // mog('BlurSelectHide', {
    //   selectionText,
    //   selectionExpanded,
    //   blurSelection,
    //   blurSelectionText,
    //   focused,
    // })
    if (!focused && !isBalloonFocused) {
      setIsHidden(true)
    } else if (!selectionText) {
      setIsHidden(true)
    } else if ((selectionText && selectionExpanded) || blurSelection) {
      setIsHidden(false)
    }
  }, [focused, selectionExpanded, selectionText, blurSelection, show])

  useEffect(() => {
    clearBlurSelection(editor as any)
  }, [selectionText?.length])

  useEffect(() => {
    if (!isHidden) {
      const unsubscribe = tinykeys(window, {
        Escape: (event) => {
          event.preventDefault()
          setIsHidden(true)
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [isHidden])

  const popperResult = usePopperPosition({
    isHidden,
    getBoundingClientRect: getSelectionBoundingClientRect,
    ...options
  })

  const selectionTextLength = selectionText?.length ?? 0
  const { update } = popperResult

  useEffect(() => {
    selectionTextLength > 0 && update?.()
  }, [selectionTextLength, update])

  return popperResult
}
