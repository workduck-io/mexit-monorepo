import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Provider, useThemeContext } from '@workduck-io/mex-themes'

import { Notification } from '@mexit/shared'

import { version as packageJsonVersion } from '../package.json'

import ContextMenu from './Components/ContextMenu'
import FloatingButton from './Components/FloatingButton'
import Init from './Components/Init'
import Main from './Components/Main'
import Modals from './Components/Modals'
import { useAuthentication } from './Stores/useAuth'
import { useUserPreferenceStore } from './Stores/userPreferenceStore'
import { compareVersions, useVersionStore } from './Stores/useVersionStore'
import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'

const FORCE_LOGOUT_VERSION = '0.22.22'

const AutoThemeSwitch = () => {
  const theme = useUserPreferenceStore((state) => state.theme)
  const setTheme = useUserPreferenceStore((store) => store.setTheme)
  const { preferences, changeTheme } = useThemeContext()

  useEffect(() => {
    if (theme) {
      if (theme !== preferences) {
        changeTheme(theme.themeId, theme.mode)
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
  const setVersion = useVersionStore((store) => store.setVersion)
  const { logout } = useAuthentication()

  useEffect(() => {
    async function forceLogoutAndSetVersion() {
      const persistedVersion = useVersionStore.getState().version
      setVersion(packageJsonVersion)
      if (!(persistedVersion && compareVersions(persistedVersion, FORCE_LOGOUT_VERSION) >= 0)) {
        await logout()
      }
    }

    forceLogoutAndSetVersion()
  }, [])

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
          <ContextMenu />
        </Main>
      </Providers>
    </Router>
  )
}

export default App
