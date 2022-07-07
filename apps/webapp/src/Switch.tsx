import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom'

import EditorView from './Views/EditorView'
import { useAuthStore } from './Stores/useAuth'
import { Login } from './Views/Login'
import { Register } from './Views/Register'
import ContentEditor from './Components/Editor/ContentEditor'
import Chotu from './Components/Chotu'
import Themes from './Components/Themes'
import * as Actions from './Actions'
import Snippets from './Views/Snippets'
import SnippetEditor from './Components/Editor/SnippetEditor'

import UserPage from './Components/User/UserPage'

import { ROUTE_PATHS } from './Hooks/useRouting'
import Settings from './Views/Settings'
import Search from './Views/Search'
import PublicNodeView from './Views/PublicNodeView'
import styled from 'styled-components'
import { ForgotPassword } from './Views/ForgotPassword'
import Tasks from './Views/Tasks'
import Archive from './Views/Archive'
import { animated } from 'react-spring'
import { useSidebarTransition } from './Components/Sidebar/Transition'
import DraftView from './Views/DraftView'
import Tag from './Views/Tag'
import Shortcuts from './Views/Settings/Shortcuts'
import About from './Views/Settings/About'
import { useLayoutStore } from './Stores/useLayoutStore'
import SplashScreen from './Components/SplashScreen'
import Portals from './Components/Portals'
import PortalsPage from './Views/PortalsPage'
import RemindersAll from './Views/Reminders/RemindersAll'
import GenericOAuthRedirect from './Components/OAuth/GenericOAuthRedirect'
import RouteNotFound from './Components/404'

export const SwitchWrapper = styled(animated.div)<{ $isAuth?: boolean }>`
  /* position: fixed; */
  /* width: ${({ theme, $isAuth }) =>
    !$isAuth ? '100% !important' : `calc(100% - 300px - ${theme.additional.hasBlocks ? '3rem' : '0px'})`}; */
  width: 100% !important;
  overflow-x: hidden;
  overflow-y: auto;
`

const ProtectedRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  const location = useLocation()

  const showLoader = useLayoutStore((store) => store.showLoader)
  if (showLoader) return <SplashScreen />

  return authenticated ? children : <Navigate to={ROUTE_PATHS.login} state={{ from: location }} replace />
}

const AuthRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)

  const { from } = (useLocation()?.state as { from: Location }) || { from: { pathname: ROUTE_PATHS.home } }
  const showLoader = useLayoutStore((store) => store.showLoader)
  if (showLoader) return <SplashScreen />

  return !authenticated ? children : <Navigate to={from} />
}

const AuthRoutes = () => {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />

      <Route
        path="forgotpassword"
        element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        }
      />

      <Route
        path="register"
        element={
          <AuthRoute>
            <Register />
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
        <Route path="epoch" element={<Actions.UnixEpochConverter />} />
      </Route>
    </Routes>
  )
}

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      >
        <Route path="about" element={<About />} />
        <Route path="themes" element={<Themes />} />
        <Route path="user" element={<UserPage />} />
        <Route path="shortcuts" element={<Shortcuts />} />
      </Route>
    </Routes>
  )
}

const SnippetRoutes = () => {
  return (
    <Routes>
      <Route index element={<Snippets />} />
      <Route path="node/:snippetid" element={<SnippetEditor />} />
    </Routes>
  )
}

const IntegrationRoutes = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <ProtectedRoute>
            <PortalsPage />
          </ProtectedRoute>
        }
      />
      <Route path="portal/:actionGroupId" element={<Portals />} />
    </Routes>
  )
}

export const Switch = () => {
  const authenticated = useAuthStore((s) => s.authenticated)

  const { switchWrapperSpringProps } = useSidebarTransition()

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <SwitchWrapper style={switchWrapperSpringProps} $isAuth={authenticated}>
      <Routes>
        <Route path={`${ROUTE_PATHS.auth}/*`} element={<AuthRoutes />} />
        <Route path={`${ROUTE_PATHS.oauth}/:serviceName`} element={<GenericOAuthRedirect />} />
        <Route path={ROUTE_PATHS.chotu} element={<Chotu />} />
        <Route path={`${ROUTE_PATHS.actions}/*`} element={<ActionsRoutes />} />
        <Route path={`${ROUTE_PATHS.share}/:nodeId`} element={<PublicNodeView />} />
        <Route
          path={ROUTE_PATHS.home}
          element={
            <ProtectedRoute>
              <EditorView />
            </ProtectedRoute>
          }
        >
          <Route index element={<DraftView />} />
          <Route path={`${ROUTE_PATHS.editor}/:nodeId`} element={<ContentEditor />} />
          <Route path={`${ROUTE_PATHS.settings}/*`} element={<SettingsRoutes />} />
          <Route path={`${ROUTE_PATHS.snippets}/*`} element={<SnippetRoutes />} />
          <Route path={ROUTE_PATHS.search} element={<Search />} />
          <Route path={ROUTE_PATHS.tasks} element={<Tasks />} />
          <Route
            path={ROUTE_PATHS.reminders}
            element={
              <ProtectedRoute>
                <RemindersAll />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTE_PATHS.archive} element={<Archive />} />
          <Route path={`${ROUTE_PATHS.tag}/:tag`} element={<Tag />} />
          <Route path={`${ROUTE_PATHS.integrations}/*`} element={<IntegrationRoutes />} />
        </Route>
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </SwitchWrapper>
  )
}

export default Switch
