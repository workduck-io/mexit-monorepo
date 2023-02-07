import { API_BASE_URLS } from '@mexit/core'
import { PrimaryText } from '@mexit/shared'

import { LoginContainer } from './rhsLogin.styled'
import { MexLogin } from './styled'

export const RHSLogin = () => {
  const onLoginClick = () => {
    // TODO: Add redirect from new window on login if `extension` flag is present
    // using window.opener in web app
    window.open(`${API_BASE_URLS.frontend}/auth/login?extension=true`, 'mexit-page')
  }

  return (
    <LoginContainer id="wd-mexit-login-container">
      <PrimaryText onClick={onLoginClick}>Login</PrimaryText>
      &nbsp;&nbsp;to use
      <MexLogin>MexIt</MexLogin>
    </LoginContainer>
  )
}
