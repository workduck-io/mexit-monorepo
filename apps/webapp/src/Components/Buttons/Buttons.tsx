import React from 'react'
import { useTheme } from 'styled-components'
import { AsyncButton, AsyncButtonProps, GoogleAuthButton, Loading } from '@mexit/shared'
import { Icon } from '@iconify/react'
import { useAuthentication, useAuthStore } from '../../Stores/useAuth'
import { IS_DEV, MEXIT_FRONTEND_AUTH_BASE } from '@mexit/core'
import config from '../../config'
import { OptionButton } from '../../Style/AuthFlow'
export interface LoadingButtonProps {
  children?: React.ReactNode
  loading?: boolean
  dots?: number
  /** Also disable the button with a boolean condition */
  alsoDisabled?: boolean
  buttonProps?: AsyncButtonProps
  style?: any
}

export interface GoogleLoginButtonProps {
  text: string
}

export const LoadingButton = ({ children, dots, loading, alsoDisabled, buttonProps, style }: LoadingButtonProps) => {
  const theme = useTheme()
  return (
    <AsyncButton disabled={alsoDisabled || loading} {...buttonProps} style={style}>
      {!loading && children}
      {loading && (
        <>
          <Loading transparent dots={dots ?? 5} color={theme.colors.primary} />
          {children}
        </>
      )}
    </AsyncButton>
  )
}
export const GoogleLoginButton = ({ text }: GoogleLoginButtonProps) => {
  const { loginViaGoogle } = useAuthentication()
  const baseAuthURL = 'https://workduck.auth.us-east-1.amazoncognito.com/oauth2/authorize'
  const searchParams = new URLSearchParams({
    identity_provider: 'Google',
    response_type: 'code',
    redirect_uri: MEXIT_FRONTEND_AUTH_BASE,
    client_id: config.cognito.APP_CLIENT_ID,
    scope: config.cognito.SCOPES
  })

  const URLObject = new URL(baseAuthURL)
  URLObject.search = searchParams.toString()

  const authURL = URLObject.toString()

  const openUrl = (url) => {
    window.open(url, '_self')
    // if (newWindow) newWindow.opener = null
  }
  return (
    <OptionButton
      onClick={() => {
        openUrl(authURL)
      }}
    >
      <div style={{ marginRight: 1, width: 25, height: 25, marginTop: 1 }}>
        <Icon fontSize={23} icon="flat-color-icons:google" />
      </div>
      <div>{text}</div>
    </OptionButton>
  )
}
