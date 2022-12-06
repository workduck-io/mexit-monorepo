import { useEffect } from 'react'

import { useAuthStore } from '../Stores/useAuth'

import { useEditorBuffer, useSnippetBuffer } from './useEditorBuffer'

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

      return () => window.removeEventListener('beforeunload', onUnload)
    }
  }, [authenticated])
}
