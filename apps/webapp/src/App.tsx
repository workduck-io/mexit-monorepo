import React, { useEffect } from 'react'

import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { defaultThemes } from '@mexit/shared'
import { Notification } from '@mexit/shared'

import FloatingButton from './Components/FloatingButton'
import Init from './Components/Init'
import Main from './Components/Main'
import Modals from './Components/Modals'
import './Stores'
import useThemeStore from './Stores/useThemeStore'
import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'

function App() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <Router>
      <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
        <Init />
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
