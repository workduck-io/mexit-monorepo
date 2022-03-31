import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom'

import MainArea from './Views/MainArea'
import { useAuthStore, useAuthentication } from './Stores/useAuth'
import { Login } from './Views/Login'
import { Register } from './Views/Register'
import Footer from './Components/Footer'
import ContentEditor from './Components/Editor/ContentEditor'
import Chotu from './Components/Chotu'
import Themes from './Components/Themes'
import * as Actions from './Actions'
import ActivityView from './Views/ActivityView'
import Snippets from './Views/Snippets'
import SnippetEditor from './Components/Editor/SnippetEditor'

import UserPage from './Components/User/UserPage'

import { ROUTE_PATHS } from './Hooks/useRouting'
import Settings from './Views/Settings'
import Search from './Views/Search'
import PublicNodeView from './Views/PublicNodeView'
import OAuthDesktop from './Components/OAuthDesktop'
import Navbar from './Components/Navbar'
import config from './config'
import { MEXIT_FRONTEND_URL_BASE } from '@mexit/shared'
import jwtDecode from 'jwt-decode'
import toast from 'react-hot-toast'
import Loading from './Style/Loading'
import { useTheme } from 'styled-components'

const ProtectedRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)

  // if (code) {
  //   console.log({ code })

  //   let tripletTokens: any
  //   ;(async () => {
  //     tripletTokens = await loginViaGoogle(code, config.cognito.APP_CLIENT_ID, MEXIT_FRONTEND_URL_BASE)

  //     if (tripletTokens) {
  //       console.log('hit')

  //       const decodedIdToken: any = jwtDecode(tripletTokens.id_token)

  //       localStorage.setItem(
  //         `CognitoIdentityServiceProvider.${config.cognito.APP_CLIENT_ID}.${decodedIdToken.email}.idToken`,
  //         tripletTokens.id_token.toString()
  //       )
  //       localStorage.setItem(
  //         `CognitoIdentityServiceProvider.${config.cognito.APP_CLIENT_ID}.${decodedIdToken.email}.accessToken`,
  //         tripletTokens.access_token.toString()
  //       )
  //       localStorage.setItem(
  //         `CognitoIdentityServiceProvider.${config.cognito.APP_CLIENT_ID}.${decodedIdToken.email}.refreshToken`,
  //         tripletTokens.refresh_token.toString()
  //       )
  //     }
  //     // window.close()
  //     return <Navigate to="/blank?google_auth=success" />
  //   })()

  // return <Navigate to="/blank?google_auth=success" />
  // }

  console.log('AUTHENTICATED: ', authenticated)

  return authenticated ? children : <Navigate to={ROUTE_PATHS.login} />
}

const AuthRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const theme = useTheme()
  const { loginViaGoogle } = useAuthentication()

  console.log('auth', { authenticated, isLoading })
  const code = new URLSearchParams(window.location.search).get('code')

  useEffect(() => {
    const setAsyncLocal = async () => {
      setIsLoading(true)
      console.log('caaling')
      const res = await loginViaGoogle(code, config.cognito.APP_CLIENT_ID, MEXIT_FRONTEND_URL_BASE)
      return res
    }

    console.log('code', { code })

    if (code) {
      setAsyncLocal()
        .then(({ tokens }) => {
          if (tokens) {
            console.log({ tokens })
            const decodedIdToken: any = jwtDecode(tokens.id_token)
            console.log('b')

            const localConfig = {
              idToken: `CognitoIdentityServiceProvider.${config.cognito.APP_CLIENT_ID}.${decodedIdToken.email}.idToken`,
              accessToken: `CognitoIdentityServiceProvider.${config.cognito.APP_CLIENT_ID}.${decodedIdToken.email}.accessToken`,
              refreshToken: `CognitoIdentityServiceProvider.${config.cognito.APP_CLIENT_ID}.${decodedIdToken.email}.refreshToken`,
              clockDrift: `CognitoIdentityServiceProvider.${config.cognito.APP_CLIENT_ID}.${decodedIdToken.email}.clockDrift`
            }

            localStorage.setItem(localConfig.idToken, tokens.id_token.toString())
            localStorage.setItem(localConfig.accessToken, tokens.access_token.toString())
            localStorage.setItem(localConfig.refreshToken, tokens.refresh_token.toString())
            localStorage.setItem(localConfig.clockDrift, '0')
          }
          setIsLoading(false)
        })
        .catch((err) => {
          setIsLoading(false)
          toast('Something went wrong!')
        })
    }
  }, [code])

  if (isLoading)
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <Loading transparent dots={4} color={theme.colors.primary} />
        <h3>Signing in</h3>
      </div>
    )

  return !authenticated ? children : <Navigate to={ROUTE_PATHS.home} />
}

const AuthRoutes = () => {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <AuthRoute>
            <Login />
            <Footer />
          </AuthRoute>
        }
      />

      <Route
        path="register"
        element={
          <AuthRoute>
            <Register />
            <Footer />
          </AuthRoute>
        }
      />
    </Routes>
  )
}

const ActionsRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        }
      />

      <Route path="">
        <Route path="shortener" element={<Actions.AliasWrapper />} />
        <Route path="color-picker" element={<Actions.ColourPicker />} />
        <Route path="corpbs" element={<Actions.CorporateBS />} />
        <Route path="currency-convertor" element={<Actions.CurrencyConverter />} />
        <Route path="epoch" element={<Actions.UnixEpochConverter />} />
      </Route>
    </Routes>
  )
}

const PublicNodeRoutes = () => {
  return <Route path=":nodeId" element={<PublicNodeView />} />
}

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <ProtectedRoute>
            <Navbar />
            <Settings />
          </ProtectedRoute>
        }
      >
        <Route path="themes" element={<Themes />} />
        <Route path="user" element={<UserPage />} />
      </Route>
    </Routes>
  )
}

const SnippetRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <ProtectedRoute>
            <MainArea />
          </ProtectedRoute>
        }
      >
        <Route index element={<Snippets />} />
        <Route path="node/:snippetid" element={<SnippetEditor />} />
      </Route>
    </Routes>
  )
}

export const Switch = () => {
  return (
    <Routes>
      <Route path={`${ROUTE_PATHS.auth}/*`} element={<AuthRoutes />} />
      <Route path={ROUTE_PATHS.oauthdesktop} element={<OAuthDesktop />} />
      <Route path={ROUTE_PATHS.chotu} element={<Chotu />} />
      <Route path={`${ROUTE_PATHS.actions}/*`} element={<ActionsRoutes />} />
      <Route path={ROUTE_PATHS.share} element={<PublicNodeRoutes />} />
      <Route path={`${ROUTE_PATHS.settings}/*`} element={<SettingsRoutes />} />
      <Route path={`${ROUTE_PATHS.snippets}/*`} element={<SnippetRoutes />} />

      <Route
        path={ROUTE_PATHS.home}
        element={
          <ProtectedRoute>
            <MainArea />
          </ProtectedRoute>
        }
      >
        <Route index element={<ActivityView />} />
        <Route path={`${ROUTE_PATHS.home}/:nodeId`} element={<ContentEditor />} />
        <Route path={ROUTE_PATHS.search} element={<Search />} />
      </Route>
    </Routes>
  )
}

export default Switch
