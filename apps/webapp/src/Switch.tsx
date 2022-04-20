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
import { Loading } from '@mexit/shared'
import toast from 'react-hot-toast'
import { useTheme } from 'styled-components'
import { MEXIT_FRONTEND_AUTH_BASE } from '@mexit/core'

const ProtectedRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)

  return authenticated ? children : <Navigate to={ROUTE_PATHS.login} />
}

const AuthRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const theme = useTheme()
  const { loginViaGoogle } = useAuthentication()

  const code = new URLSearchParams(window.location.search).get('code')

  useEffect(() => {
    const setAsyncLocal = async () => {
      setIsLoading(true)
      const res = await loginViaGoogle(code, config.cognito.APP_CLIENT_ID, MEXIT_FRONTEND_AUTH_BASE)
      return res
    }

    if (code) {
      setAsyncLocal()
        .catch((err) => {
          setIsLoading(false)
          toast('Something went wrong!')
        })
        .finally(() => {
          setIsLoading(false)
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
        <Route path="shortener" element={<Actions.Shortener />} />
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
