import { Icon } from '@iconify/react'

import { Button } from '@workduck-io/mex-components'

import { MEXIT_FRONTEND_AUTH_BASE } from '@mexit/core'

import config from '../../config'

export interface GoogleLoginButtonProps {
  text: string
}

export const GoogleLoginButton = ({ text }: GoogleLoginButtonProps) => {
  // const { loginViaGoogle } = useAuthentication()
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

  const openUrl = (url: string) => {
    window.open(url, '_self')
    // if (newWindow) newWindow.opener = null
  }

  return (
    <Button
      large={true}
      onClick={() => {
        openUrl(authURL)
      }}
    >
      <div style={{ marginRight: 8, width: 25, height: 25, marginTop: 1 }}>
        <Icon fontSize={23} icon="flat-color-icons:google" />
      </div>
      <div>{text}</div>
    </Button>
  )
}
