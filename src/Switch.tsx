import React, { useEffect } from 'react'
import { Navigate, Route, RouteProps, Routes } from 'react-router-dom'
import { useAuth } from '@workduck-io/dwindle'
import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import { init as SentryInit } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

import MainArea from './Views/MainArea'
import { useAuthStore } from './Hooks/useAuth'
import config from './config'
import { Login } from './Views/Login'
import { Register } from './Views/Register'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'

const ProtectedRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  return authenticated ? children : <Navigate to="/login" />
}

const AuthRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  return !authenticated ? children : <Navigate to="/" />
}

const Switch = () => {
  const { initCognito } = useAuth()
  const routingInstrumentation = useRoutingInstrumentation()

  useEffect(() => {
    const userAuthenticatedEmail = initCognito({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    })

    console.log('User Authenticated Email: ', userAuthenticatedEmail)
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

    console.log('Sentry Initialized!')
  }, [routingInstrumentation])

  return (
    <Routes>
      <Route path="/hello" element={<h1>Hello World</h1>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navbar />
            <MainArea />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
            <Footer />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
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

export default Switch
