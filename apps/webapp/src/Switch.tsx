import React from 'react'
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

const ProtectedRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  const { loginViaGoogle } = useAuthentication()
  const { hash } = useLocation()
  let accessToken: string
  let idToken: string

  if (hash) {
    accessToken = new URLSearchParams(hash).get('#access_token')
    idToken = new URLSearchParams(hash).get('id_token')
    localStorage.setItem('mex-google-access-token', accessToken.toString())
    localStorage.setItem('mex-google-id-token', idToken.toString())
    ;(async () => await loginViaGoogle(idToken, accessToken, true))()
    window.close()
    return <Navigate to="/blank?google_auth=success" />
  }

  return authenticated ? children : <Navigate to="/login" />
}

const AuthRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
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

      <Route path={ROUTE_PATHS.actions}>
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

const EditorRoutes = () => {
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
        <Route index element={<ActivityView />} />
        <Route path={`${ROUTE_PATHS.home}/:nodeId`} element={<ContentEditor />} />
        <Route path={ROUTE_PATHS.search} element={<Search />} />
      </Route>
    </Routes>
  )
}

export const Switch = () => {
  return (
    <Routes>
      <Route path={`${ROUTE_PATHS.auth}/*`} element={<AuthRoutes />} />
      <Route path={ROUTE_PATHS.oauthdesktop} element={<OAuthDesktop />} />
      <Route path={`${ROUTE_PATHS.home}/*`} element={<EditorRoutes />} />
      <Route path={ROUTE_PATHS.chotu} element={<Chotu />} />
      <Route path={`${ROUTE_PATHS.actions}/*`} element={<ActionsRoutes />} />
      <Route path={ROUTE_PATHS.share} element={<PublicNodeRoutes />} />
      <Route path={`${ROUTE_PATHS.settings}/*`} element={<SettingsRoutes />} />
      <Route path={`${ROUTE_PATHS.snippets}/*`} element={<SnippetRoutes />} />
    </Routes>
  )
}

export default Switch
