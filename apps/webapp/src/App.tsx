import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { useAuth } from '@workduck-io/dwindle'
import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import { init as SentryInit } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { IS_DEV } from '@mexit/core'


import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'
import useThemeStore from './Stores/useThemeStore'
import { defaultThemes } from '@mexit/shared'
import Modals from './Components/Modals'
import { Notification } from '@mexit/shared'
import Main from './Components/Main'
import config from './config'
import Analytics from './Utils/analytics'

function App() {
  const theme = useThemeStore((state) => state.theme)
  const { initCognito } = useAuth()

  useEffect(() => {
    initCognito({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    })
  }, [])

  const routingInstrumentation = useRoutingInstrumentation()
  useEffect(() => {
    if (!IS_DEV) {
      const browserTracing = new BrowserTracing({
        routingInstrumentation
      })

      SentryInit({
        dsn: 'https://53b95f54a627459c8d0e74b9bef36381@o1135527.ingest.sentry.io/6184488',
        tracesSampleRate: 1.0,
        integrations: [browserTracing]
      })

      if (import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP && typeof import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP === 'string')
        Analytics.init(import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP)

    }
  }, [routingInstrumentation])


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
