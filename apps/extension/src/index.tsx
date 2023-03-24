import React, { useEffect } from 'react'

import { Provider, useThemeContext } from '@workduck-io/mex-themes'

import { userPreferenceStore as useUserPreferenceStore } from '@mexit/core'
import { Notification } from '@mexit/shared'

import { GlobalStyle } from './Styles/GlobalStyle'
import Extension from './app'

const AutoThemeSwitch = () => {
  const theme = useUserPreferenceStore((state) => state.theme)
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

export default function Index() {
  return (
    <Providers>
      <GlobalStyle />
      <Notification />
      <Extension />
    </Providers>
  )
}
