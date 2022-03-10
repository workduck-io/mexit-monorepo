import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'

import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'
import { lightTheme } from '@mexit/shared'

//----------Styled Components------------

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Router>
        <AppContainer>
          <GlobalStyle />
          <Switch />
        </AppContainer>
      </Router>
    </ThemeProvider>
  )
}

export default App
