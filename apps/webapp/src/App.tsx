import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { useAuth } from '@workduck-io/dwindle'


import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'
import useThemeStore from './Stores/useThemeStore'
import { defaultThemes } from '@mexit/shared'
import Modals from './Components/Modals'
import { Notification } from '@mexit/shared'
import Main from './Components/Main'
import config from './config'

import './Stores'

function App() {
  const theme = useThemeStore((state) => state.theme)
  const { initCognito } = useAuth()

  useEffect(() => {
    initCognito({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    })
  }, []) // eslint-disable-line

  return (
    <Router>
      <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
        <Main>
          <GlobalStyle />
          <Modals />
          <Switch />
          <Notification />
        </Main>
      </ThemeProvider>
    </Router>
  )
}

export default App
