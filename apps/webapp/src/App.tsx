import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { Provider, useThemeContext } from '@workduck-io/mex-themes'

import {
  compareVersions,
  emitter,
  mog,
  propertyChangeHandler,
  useAppStore,
  userPreferenceStore as useUserPreferenceStore
} from '@mexit/core'
import { Notification } from '@mexit/shared'

import { version as packageJsonVersion } from '../package.json'

import ContextMenu from './Components/ContextMenu'
import FloatingButton from './Components/FloatingButton'
import Init from './Components/Init'
import Main from './Components/Main'
import Modals from './Components/Modals'
import { createViewFilterStore, ViewFilterProvider } from './Hooks/todo/useTodoFilters'
import { useForceLogout } from './Stores/useAuth'
import GlobalStyle from './Style/GlobalStyle'
import Switch from './Switch'

const FORCE_LOGOUT_VERSION = '0.23.9'

const AutoThemeSwitch = () => {
  const theme = useUserPreferenceStore((state) => state.theme)
  const hasHydrated = useUserPreferenceStore((s) => s._hasHydrated)
  const { preferences, changeTheme } = useThemeContext()

  useEffect(() => {
    if (theme && hasHydrated) {
      if (theme !== preferences) {
        changeTheme(theme.themeId, theme.mode)
      }
    }
  }, [theme, hasHydrated])

  return null
}

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider legacySupport={false}>
      <ViewFilterProvider createStore={createViewFilterStore}>
        <AutoThemeSwitch />
        {children}
      </ViewFilterProvider>
    </Provider>
  )
}

const App = () => {
  const setVersion = useAppStore((store) => store.setVersion)
  const { forceLogout } = useForceLogout()
  useEffect(() => {
    emitter.on('propertyChanged', propertyChangeHandler)
    async function forceLogoutAndSetVersion() {
      const persistedVersion = useAppStore.getState()?.version
      mog('PersistedVersion | PackageJSONVersion', { persistedVersion, packageJsonVersion })
      setVersion(packageJsonVersion)
      if (!(persistedVersion && compareVersions(persistedVersion, FORCE_LOGOUT_VERSION) >= 0)) {
        await forceLogout()
        // Needed because nothing sets version store after force logout; DO NOT REMOVE❗️
        setVersion(packageJsonVersion)
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
