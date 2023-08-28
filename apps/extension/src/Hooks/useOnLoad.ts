import { useEffect, useState } from 'react'

import { useAuthStore } from '@mexit/core'

export const useOnLoad = () => {
  const [hostLocation, sethostLocation] = useState(document.location.href)
  const authenticated = useAuthStore((s) => s.authenticated)

  useEffect(() => {
    if (authenticated) {
      const onUnload = () => {
        const routingObserver = new MutationObserver((mutations) =>
          mutations.forEach(() => {
            if (hostLocation !== document.location.href) sethostLocation(document.location.href)
          })
        )

        routingObserver.observe(document.querySelector('body'), { childList: true, subtree: true })
      }

      window.addEventListener('DOMContentLoaded', onUnload)

      return () => {
        window.removeEventListener('DOMContentLoaded', onUnload)
      }
    }
  }, [authenticated, hostLocation])

  return hostLocation
}
