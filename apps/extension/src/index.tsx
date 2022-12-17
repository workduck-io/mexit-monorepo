import React, { useEffect } from 'react'

import styled, { useTheme } from 'styled-components'

import { Provider, useThemeContext } from '@workduck-io/mex-themes'

import { mog } from '@mexit/core'
import { Notification } from '@mexit/shared'

import { useUserPreferenceStore } from './Stores/userPreferenceStore'
import { GlobalStyle } from './Styles/GlobalStyle'
import Extension from './app'

const AutoThemeSwitch = () => {
  const theme = useUserPreferenceStore((state) => state.theme)
  const { themes, preferences, changeTheme } = useThemeContext()
  const curTheme = useTheme()

  mog('theme', { theme, preferences, curTheme })

  useEffect(() => {
    changeTheme(preferences.themeId)
  }, [])

  useEffect(() => {
    if (theme) {
      if (theme !== preferences.themeId) {
        mog('theme', { theme, preferences })
        changeTheme(theme)
      }
    }
  }, [theme])

  return null
}

const SimpleCompo = styled.div`
  background: ${({ theme }) => {
    console.log({ theme })
    return theme.tokens.surfaces.app
  }};
`

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider legacySupport={false}>
      <div>Simple</div>
      <SimpleCompo>What is this</SimpleCompo>
      <AutoThemeSwitch />
      {children}
    </Provider>
  )
}

// const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const theme = useUserPreferenceStore((state) => state.theme)

//   const themeData = useMemo(() => {
//     const ctheme = defaultThemes.find((t) => t.id === theme)
//     return ctheme ? ctheme.themeData : defaultThemes[0].themeData
//   }, [theme])

//   return <ThemeProvider theme={themeData}>{children}</ThemeProvider>
// }

export default function Index() {
  return (
    <Providers>
      <GlobalStyle />
      <Notification />
      <Extension />
    </Providers>
  )
}
