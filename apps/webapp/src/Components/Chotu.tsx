import React, { useEffect, useState } from 'react'
import { useSearch } from '../Hooks/useSearch'
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

  const { ilinks, archive } = useDataStore()
  const contents = useContentStore((state) => state.contents)
  const [first, setFirst] = useState(true)

  useEffect(() => {
    if (!first) {
      initSearchIndex({ ilinks, archive, contents, snippets })
    } else {
      setFirst(false)
    }
  }, [ilinks, archive, contents, snippets])
  const { queryIndex } = useSearch()

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

  const handleEvent = async (event) => {
    switch (event.data.type) {
      case 'search': {
        console.log('search value', event.data.data.query)
        const res = await queryIndex('node', event.data.data.query)
        window.parent.postMessage({ type: 'search', res }, '*')
      }
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleEvent)
    return () => {
      window.removeEventListener('message', handleEvent)
    }
  }, [])

  return (
    <div>
      <p>
        Good work on finding this, reach us out at <a href="mailto:tech@workduck.io">tech@workduck.io</a>
      </p>
    </div>
  )
}
