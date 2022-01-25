import React, { useEffect } from 'react'
import useAuth from '../Hooks/useDwindle'

import config from '../config'

const Init = () => {
  const { initCognito } = useAuth()

  useEffect(() => {
    const userAuthenticatedEmail = initCognito({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    })

    console.log('User Authenticated Email: ', userAuthenticatedEmail)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export default Init
