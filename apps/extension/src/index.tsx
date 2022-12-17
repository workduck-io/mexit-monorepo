import React from 'react'

import styled from 'styled-components'

import { Provider } from '@workduck-io/mex-themes'

import { Notification } from '@mexit/shared'

import Extension from './app'
import { GlobalStyle } from './Styles/GlobalStyle'

// const AutoThemeSwitch = () => {
//   const theme = useUserPreferenceStore((state) => state.theme)
//   const { themes, preferences, changeTheme } = useThemeContext()
//   const curTheme = useTheme()

//   mog('theme', { theme, preferences, curTheme })

//   useEffect(() => {
//     changeTheme(preferences.themeId)
//   }, [])

//   useEffect(() => {
//     if (theme) {
//       if (theme !== preferences.themeId) {
//         mog('theme', { theme, preferences })
//         changeTheme(theme)
//       }
//     }
//   }, [theme])

//   return null
// }

const SimpleCompo = styled.div`
  background: ${({ theme }) => {
    console.log('Theme inside our styled component', { theme })
    return theme.tokens.surfaces.app
  }};
`

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // <AutoThemeSwitch />
  return (
    <Provider legacySupport={false}>
      <div>Simple</div>
      <SimpleCompo>What is this</SimpleCompo>
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
