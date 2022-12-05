import React, { useMemo } from 'react'

import { ThemeProvider } from 'styled-components'

import { defaultThemes, Notification } from '@mexit/shared'

import { useUserPreferenceStore } from './Stores/userPreferenceStore'
import { GlobalStyle } from './Styles/GlobalStyle'
import Extension from './app'

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useUserPreferenceStore((state) => state.theme)

  const themeData = useMemo(() => {
    const ctheme = defaultThemes.find((t) => t.id === theme)
    return ctheme ? ctheme.themeData : defaultThemes[0].themeData
  }, [theme])

  return <ThemeProvider theme={themeData}>{children}</ThemeProvider>
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
