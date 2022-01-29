import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import GlobalStyle from './Shared/GlobalStyle'
import theme from './Shared/theme'
import Switch from './Switch'
import Analytics from './Utils/analytics'

//----------Styled Components------------

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`

//======================================

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
