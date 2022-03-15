import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import MainArea from './Views/MainArea'
import { useAuthStore } from './Stores/useAuth'
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

const ProtectedRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  return authenticated ? children : <Navigate to="/login" />
}

const AuthRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  return !authenticated ? children : <Navigate to="/" />
}

export const Switch = () => {
  return (
    <Routes>
      <Route
        path={ROUTE_PATHS.login}
        element={
          <AuthRoute>
            <Login />
            <Footer />
          </AuthRoute>
        }
      />

      <Route path={`${ROUTE_PATHS.home}/share/:nodeId`} element={<PublicNodeView />} />

      <Route
        path={ROUTE_PATHS.register}
        element={
          <AuthRoute>
            <Register />
            <Footer />
          </AuthRoute>
        }
      />

      <Route
        path={ROUTE_PATHS.chotu}
        element={
          <ProtectedRoute>
            <Chotu />
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

        <Route path={ROUTE_PATHS.snippets} element={<Snippets />} />
        <Route path={ROUTE_PATHS.search} element={<Search />} />

        <Route path={`${ROUTE_PATHS.snippet}/:snippetid`} element={<SnippetEditor />} />
        <Route path={ROUTE_PATHS.settings} element={<Settings />}>
          <Route path="themes" element={<Themes />} />
          <Route path="user" element={<UserPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default Switch
