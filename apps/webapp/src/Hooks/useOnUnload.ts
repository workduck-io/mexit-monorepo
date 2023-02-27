import { useEffect } from 'react'

import { mog } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'

import { useEditorBuffer, useSnippetBuffer } from './useEditorBuffer'

export const useOnUnload = () => {
  const authenticated = useAuthStore((s) => s.authenticated)
  const { saveAndClearBuffer: clearNotesBuffer } = useEditorBuffer()
  const { saveAndClearBuffer: clearSnippetsBuffer } = useSnippetBuffer()

  useEffect(() => {
    if (authenticated) {
      const onUnload = () => {
        mog('Saving notes and snippets...')
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
