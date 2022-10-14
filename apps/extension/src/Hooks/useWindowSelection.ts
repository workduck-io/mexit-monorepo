import { useCallback, useEffect } from 'react'

import { mog } from '@mexit/core'

const useWindowSelection = () => {
  const getSelection = () => {
    const selection: Selection = window.getSelection()
    mog('Selection from current tab is', { selection })
    return selection
  }

  const onSelection = useCallback((ev) => {
    mog('selection', { ev })
  }, [])

  useEffect(() => {
    window.addEventListener('selectionchange', onSelection)

    return () => window.removeEventListener('selectionchange', onSelection)
  }, [])

  return {
    getSelection
  }
}

export default useWindowSelection
