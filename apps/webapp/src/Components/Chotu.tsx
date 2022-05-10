import React, { useEffect } from 'react'
import { useAuthStore } from '../Stores/useAuth'
import useContentStore from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useShortenerStore } from '../Stores/useShortener'
import { useSnippetStore } from '../Stores/useSnippetStore'
import useThemeStore from '../Stores/useThemeStore'
import { initSearchIndex } from '../Workers/controller'

export default function Chotu() {
  const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const linkCaptures = useShortenerStore((state) => state.linkCaptures)
  const theme = useThemeStore((state) => state.theme)
  const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state
  const snippets = useSnippetStore((store) => store.snippets)

  useEffect(() => {
    const { ilinks, archive } = useDataStore.getState()
    const contents = useContentStore.getState().contents
    const snippets = useSnippetStore.getState().snippets

    initSearchIndex({ ilinks, archive, contents, snippets })
  }, [])

  const message = {
    type: 'store-init',
    userDetails: userDetails,
    workspaceDetails: workspaceDetails,
    linkCaptures: linkCaptures,
    theme: theme,
    authAWS: authAWS,
    snippets: snippets
  }

  window.parent.postMessage(message, '*')

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
