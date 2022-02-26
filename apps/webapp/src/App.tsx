import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'
import Analytics from './Utils/analytics'
import useThemeStore from './Stores/useThemeStore'
import { defaultThemes } from '@mexit/shared'

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
  const theme = useThemeStore((state) => state.theme)

  return (
    <Router>
      <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
        <AppContainer>
          <GlobalStyle />
          <Switch />
        </AppContainer>
      </ThemeProvider>
    </Router>
  )
}

export default App
