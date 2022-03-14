import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import { init as SentryInit } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { useAuth } from '@workduck-io/dwindle'

import MainArea from './Views/MainArea'
import { useAuthStore } from './Stores/useAuth'
import { Login } from './Views/Login'
import { Register } from './Views/Register'
import Footer from './Components/Footer'
import ContentEditor from './Components/Editor/ContentEditor'
import Chotu from './Components/Chotu'
import Themes from './Components/Themes'
import config from './config'

import * as Actions from './Actions'
import ActivityView from './Views/ActivityView'
import Snippets from './Views/Snippets'
import SnippetEditor from './Components/Editor/SnippetEditor'

import UserPage from './Components/User/UserPage'

import { ROUTE_PATHS } from './Hooks/useRouting'
import Settings from './Views/Settings'

const ProtectedRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  return authenticated ? children : <Navigate to="/login" />
}

const AuthRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  return !authenticated ? children : <Navigate to="/" />
}

export const Switch = () => {
  const routingInstrumentation = useRoutingInstrumentation()
  const { initCognito } = useAuth()

  useEffect(() => {
    initCognito({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const browserTracing = new BrowserTracing({
      routingInstrumentation
    })

    SentryInit({
      dsn: 'https://53b95f54a627459c8d0e74b9bef36381@o1135527.ingest.sentry.io/6184488',
      tracesSampleRate: 1.0,
      integrations: [browserTracing]
    })
  }, [routingInstrumentation])

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
        path={ROUTE_PATHS.home}
        element={
          <ProtectedRoute>
            <MainArea />
          </ProtectedRoute>
        }
      >
        <Route index element={<ActivityView />} />

        <Route path={`${ROUTE_PATHS.node}/:nodeId`} element={<ContentEditor />} />

        <Route path={ROUTE_PATHS.snippets} element={<Snippets />} />
        {/* <Route path={ROUTE_PATHS.search} element={<Search />} /> */}

        <Route path={`${ROUTE_PATHS.snippet}/:snippetid`} element={<SnippetEditor />} />
        <Route path={ROUTE_PATHS.settings} element={<Settings />}>
          <Route path="themes" element={<Themes />} />
          <Route path="user" element={<UserPage />} />
        </Route>

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
      </Route>
    </Routes>
  )
}

export default Switch
