import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTheme } from 'styled-components'

import { MEXIT_FRONTEND_AUTH_BASE } from '@mexit/core'
import { Loading } from '@mexit/shared'

import { useAuthentication } from '../../Stores/useAuth'
import config from '../../config'

const GoogleOAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const theme = useTheme()
  const { loginViaGoogle } = useAuthentication()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    console.log('Did it even get here?')
    const setAsyncLocal = async () => {
      setIsLoading(true)
      const res = await loginViaGoogle(code, config.cognito.APP_CLIENT_ID, MEXIT_FRONTEND_AUTH_BASE)
      return res
    }
    if (code) {
      setAsyncLocal()
        .catch((err) => {
          toast('Something went wrong!')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, []) // eslint-disable-line

  if (isLoading)
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Loading transparent dots={4} color={theme.colors.primary} />
        <h3>Signing in</h3>
      </div>
    )

  return null
}

export default GoogleOAuth
