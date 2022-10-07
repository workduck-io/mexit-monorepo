import React from 'react'

import { theme } from 'react-contexify'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { defaultThemes, Notification } from '@mexit/shared'

import FloatingButton from './Components/FloatingButton'
import Main from './Components/Main'
import Modals from './Components/Modals'
import './Stores'
import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'

function App() {
  return (
    <Router>
      <ThemeProvider theme={defaultThemes[0].themeData}>
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
