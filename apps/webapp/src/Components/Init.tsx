import React, { useEffect } from 'react'

import { useAuth } from '@workduck-io/dwindle'

import { addIconsToIconify } from '@mexit/shared'

import { useInitLoader } from '../Hooks/useInitLoader'
import config from '../config'

const Init = () => {
  const { initCognito } = useAuth()

  useEffect(() => {
    const initUserAndApp = () => {
      initCognito({
        UserPoolId: config.cognito.USER_POOL_ID,
        ClientId: config.cognito.APP_CLIENT_ID
      })

      addIconsToIconify()
    }

    initUserAndApp()
  }, [])

  useInitLoader()

  return null
}

export default Init
