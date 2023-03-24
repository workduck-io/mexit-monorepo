import { useEffect } from 'react'

import { useFocused } from 'slate-react'

import { useEditorStore } from '@mexit/core'


export const useGlobalListener = () => {
  const setIsUserTyping = useEditorStore((store) => store.setIsEditing)

  const hasFocus = useFocused()

  useEffect(() => {
    const keyboardHandler = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.altKey || event.metaKey) return
      setIsUserTyping(true)
    }

    // * Only add listener when focus is on editor
    if (hasFocus) window.addEventListener('keydown', keyboardHandler)

    return () => {
      return window.removeEventListener('keydown', keyboardHandler)
    }
  }, [hasFocus])

  useEffect(() => {
    const mouseHandler = () => {
      setIsUserTyping(false)
    }

    window.addEventListener('mousemove', mouseHandler)

    return () => window.removeEventListener('mousemove', mouseHandler)
  }, [])
}
