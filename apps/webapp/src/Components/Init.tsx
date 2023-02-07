import { useEffect } from 'react'

import { useAuth } from '@workduck-io/dwindle'

import { API, API_BASE_URLS, config } from '@mexit/core'
import { addIconsToIconify } from '@mexit/shared'

import { useInitLoader } from '../Hooks/useInitLoader'
import { useOnUnload } from '../Hooks/useOnUnload'
import { useAutoSyncUserPreference } from '../Hooks/useSyncUserPreferences'
import syncStores from '../Sync'

const Init = () => {
  const { initCognito } = useAuth()
  useEffect(() => {
    API.init()
    const initUserAndApp = () => {
      initCognito(
        {
          UserPoolId: config.cognito.USER_POOL_ID,
          ClientId: config.cognito.APP_CLIENT_ID
        },
        {
          identityPoolID: config.cognito.IDENTITY_POOL_ID,
          CDN_BASE_URL: API_BASE_URLS.cdn
        }
      )

      addIconsToIconify()
    }

    initUserAndApp()
    syncStores()
  }, [])

  useInitLoader()
  useOnUnload()
  useAutoSyncUserPreference()

  return null
}

export default Init
