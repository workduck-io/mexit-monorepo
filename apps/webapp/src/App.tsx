import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'
import useThemeStore from './Stores/useThemeStore'
import { defaultThemes } from '@mexit/shared'
import Modals from './Views/Modals'
import Init from './Components/Init'
import { Notification } from '@mexit/shared'

//----------Styled Components------------

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

function App() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <Router>
      <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
        <AppContainer>
          <Init />
          <GlobalStyle />
          <Modals />
          <Switch />
          <Notification />
        </AppContainer>
      </ThemeProvider>
    </Router>
  )
}

export default App
