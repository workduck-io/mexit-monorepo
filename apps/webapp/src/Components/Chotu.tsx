import React from 'react'
import { useAuthStore } from '../Stores/useAuth'
import { useShortenerStore } from '../Stores/useShortener'
import useThemeStore from '../Stores/useThemeStore'

export default function Chotu() {
  const userDetails = useAuthStore((store) => store.userDetails)
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const linkCaptures = useShortenerStore((state) => state.linkCaptures)
  const theme = useThemeStore((state) => state.theme)
  const authAWS = JSON.parse(localStorage.getItem('auth-aws')).state

  const message = {
    type: 'store-init',
    userDetails: userDetails,
    workspaceDetails: workspaceDetails,
    linkCaptures: linkCaptures,
    theme: theme,
    authAWS: authAWS
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
