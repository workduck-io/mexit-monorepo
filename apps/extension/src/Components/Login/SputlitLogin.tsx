import { BASE_URLS } from '@mexit/core'
import { PrimaryText } from '@mexit/shared'

import { MexLogin, StyledLoginContainer } from './styled'

export const SputlitLogin = () => {
  const onLoginClick = () => {
    // TODO: Add redirect from new window on login if `extension` flag is present
    // using window.opener in web app
    window.open(`${BASE_URLS.frontend}/auth/login?extension=true`)
  }

  return (
    <StyledLoginContainer id="wd-mex-spotlight-login-container">
      <h2>
        <PrimaryText onClick={onLoginClick} style={{ cursor: 'pointer' }}>
          Log in&nbsp;&nbsp;
        </PrimaryText>{' '}
        to use<MexLogin>MexIt</MexLogin>
      </h2>
    </StyledLoginContainer>
  )
}
