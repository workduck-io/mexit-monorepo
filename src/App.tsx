import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import * as Sentry from '@sentry/react'

import GlobalStyle from './Style/GlobalStyle'
import theme from './Style/theme'
import Switch from './Switch'
import Analytics from './Utils/analytics'

//----------Styled Components------------

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

//======================================
Sentry.init({
  dsn: 'https://fc3e65e8069f47e8848390f9cdd22bcb@o1127358.ingest.sentry.io/6176123'
})

Analytics.init(import.meta.env.VITE_APP_MIXPANEL_TOKEN)

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AppContainer>
          <GlobalStyle />
          <Switch />
        </AppContainer>
      </ThemeProvider>
    </Router>
  )
}

export default App
