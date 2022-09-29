import React, { useEffect } from 'react'

import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { useAuth } from '@workduck-io/dwindle'

import { addIconsToIconify, defaultThemes } from '@mexit/shared'
import { Notification } from '@mexit/shared'

import FloatingButton from './Components/FloatingButton'
import Main from './Components/Main'
import Modals from './Components/Modals'
import './Stores'
import useThemeStore from './Stores/useThemeStore'
import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'
import config from './config'

function App() {
  const theme = useThemeStore((state) => state.theme)
  const { initCognito } = useAuth()

  useEffect(() => {
    initCognito({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    })
  }, []) // eslint-disable-line

  addIconsToIconify()

  return (
    <Router>
      <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
        <Main>
          <Modals />
          <Switch />
          <GlobalStyle />
          <FloatingButton />
          <Notification />
        </Main>
      </ThemeProvider>
    </Router>
  )
}

export default App
