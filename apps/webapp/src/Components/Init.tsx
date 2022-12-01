import { useEffect } from 'react'

import { useAuth } from '@workduck-io/dwindle'

import { API } from '@mexit/core'
import { addIconsToIconify } from '@mexit/shared'

import config from '../config'
import { useInitLoader } from '../Hooks/useInitLoader'
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
          CDN_BASE_URL: 'https://cdn.workduck.io'
        }
      )

      addIconsToIconify()
    }

    initUserAndApp()
    syncStores()
  }, [])

  useInitLoader()
  useAutoSyncUserPreference()

  return null
}

export default Init
