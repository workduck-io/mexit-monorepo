import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Provider, useThemeContext } from '@workduck-io/mex-themes'

import { Notification } from '@mexit/shared'

import FloatingButton from './Components/FloatingButton'
import Init from './Components/Init'
import Main from './Components/Main'
import Modals from './Components/Modals'
import { useUserPreferenceStore } from './Stores/userPreferenceStore'
import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'

const AutoThemeSwitch = () => {
  const theme = useUserPreferenceStore((state) => state.theme)
  const { themes, preferences, changeTheme } = useThemeContext()

  useEffect(() => {
    if (theme) {
      if (theme !== preferences.themeId) {
        changeTheme(theme)
      }
    }
  }, [theme])

  return null
}

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider legacySupport={false}>
      <AutoThemeSwitch />
      {children}
    </Provider>
  )
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
