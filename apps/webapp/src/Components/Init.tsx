import { API } from '@mexit/core'
import { addIconsToIconify } from '@mexit/shared'
import { client, useAuth } from '@workduck-io/dwindle'
import { useEffect } from 'react'

import config from '../config'
import { useInitLoader } from '../Hooks/useInitLoader'
import { useAutoSyncUserPreference } from '../Hooks/useSyncUserPreferences'

const Init = () => {
  const { initCognito } = useAuth()
  useEffect(() => {
    API.init(client as any)
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
  }, [])

  useInitLoader()
  useAutoSyncUserPreference()

  return null
}

export default Init
