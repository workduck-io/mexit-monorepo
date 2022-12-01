import React, { useMemo } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { ThemeProvider } from 'styled-components'

import { defaultThemes, Notification } from '@mexit/shared'

import FloatingButton from './Components/FloatingButton'
import Init from './Components/Init'
import Main from './Components/Main'
import Modals from './Components/Modals'
import { useUserPreferenceStore } from './Stores/userPreferenceStore'
import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useUserPreferenceStore((state) => state.theme)

  const themeData = useMemo(() => {
    const ctheme = defaultThemes.find((t) => t.id === theme)
    return ctheme ? ctheme.themeData : defaultThemes[0].themeData
  }, [theme])

  return <ThemeProvider theme={themeData}>{children}</ThemeProvider>
}

const App = () => {
  return (
    <Router>
      <Providers>
        <Init />
        <Main>
          <Modals />
          <Switch />
          <GlobalStyle />
          <FloatingButton />
          <Notification />
        </Main>
      </Providers>
    </Router>
  )
}

export default App
