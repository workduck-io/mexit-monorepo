import { useEffect } from 'react'

import { useAuthStore } from '@mexit/core'

import { useEditorBuffer, useSnippetBuffer } from './useEditorBuffer'

/**
 * Hook that saves the notes and snippets buffer when the user leaves the page.
 */
export const useOnUnload = () => {
  const authenticated = useAuthStore((s) => s.authenticated)
  const { saveAndClearBuffer: clearNotesBuffer } = useEditorBuffer()
  const { saveAndClearBuffer: clearSnippetsBuffer } = useSnippetBuffer()

  useEffect(() => {
    if (authenticated) {
      const onUnload = () => {
        clearNotesBuffer()
        clearSnippetsBuffer()
      }

      window.addEventListener('beforeunload', onUnload)
      window.addEventListener('blur', onUnload)

      return () => {
        window.removeEventListener('beforeunload', onUnload)
        window.removeEventListener('blur', onUnload)
      }
    }
  }, [authenticated])
}
