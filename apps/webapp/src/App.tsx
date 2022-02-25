import { Button } from '@mexit/shared'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

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

if (process.env.NX_MIXPANEL_TOKEN_WEBAPP) {
  console.log('Token is: ', process.env.NX_MIXPANEL_TOKEN_WEBAPP)
  Analytics.init(process.env.NX_MIXPANEL_TOKEN_WEBAPP)
}

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
