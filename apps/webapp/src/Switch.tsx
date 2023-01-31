import { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { animated } from 'react-spring'

import styled from 'styled-components'

import { AppInitStatus } from '@mexit/core'
import { OverlaySidebarWindowWidth } from '@mexit/shared'

import RouteNotFound from './Components/404'
import ContentEditor from './Components/Editor/ContentEditor'
import SnippetEditor from './Components/Editor/SnippetEditor'
import GenericOAuthRedirect from './Components/OAuth/GenericOAuthRedirect'
import Portals from './Components/Portals'
import SplashScreen from './Components/SplashScreen'
import Themes from './Components/Themes'
import UserPage from './Components/User/UserPage'
import { ROUTE_PATHS } from './Hooks/useRouting'
import { useSaveNodeName } from './Hooks/useSaveNodeName'
import useSocket from './Hooks/useSocket'
import { useAuthStore } from './Stores/useAuth'
import useBlockStore from './Stores/useBlockStore'
import { useEditorStore } from './Stores/useEditorStore'
import { useLayoutStore } from './Stores/useLayoutStore'
import { SocketActionType } from './Types/Socket'
import Archive from './Views/Archive'
import DraftView from './Views/DraftView'
import EditorView from './Views/EditorView'
import { ForgotPassword } from './Views/ForgotPassword'
import LinkView from './Views/LinkView'
import { Login } from './Views/Login'
import PortalsPage from './Views/PortalsPage'
import PromptPage from './Views/Prompts/PromptPage'
import PromptProvidersPage from './Views/Prompts/PromptProvidersPage'
import PublicNamespaceView from './Views/PublicNamespaceView'
import PublicNodeView from './Views/PublicNodeView'
import { Register } from './Views/Register'
import RemindersAll from './Views/Reminders/RemindersAll'
import Search from './Views/Search'
import Settings from './Views/Settings'
import About from './Views/Settings/About'
import Shortcuts from './Views/Settings/Shortcuts'
import Snippets from './Views/Snippets'
import Tag from './Views/Tag'
import Tasks from './Views/Tasks'
import * as Actions from './Actions'

export const SwitchWrapper = styled(animated.div)<{ $isAuth?: boolean }>`
  height: 100%;

  width: 100%;
  overflow-x: hidden;
`

const ProtectedRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  const isAppInit = useAuthStore((store) => store.appInitStatus === AppInitStatus.RUNNING)

  const location = useLocation()

  return authenticated || isAppInit ? (
    <>
      {isAppInit && <SplashScreen showHints />}
      {children}
    </>
  ) : (
    <Navigate to={ROUTE_PATHS.login} state={{ from: location }} replace />
  )
}

const AuthRoute = ({ children }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  const isAppInit = useAuthStore((store) => store.appInitStatus === AppInitStatus.RUNNING)

  if (!authenticated && !isAppInit) {
    return children
  } else {
    const { from } = {
      from: { pathname: ROUTE_PATHS.home }
    }

    return <Navigate to={from} />
  }
}

const OAuthRoute = () => {
  const showLoader = useLayoutStore((store) => store.showLoader)
  if (showLoader) return <SplashScreen />

  return <GenericOAuthRedirect />
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
        <Route index element={<UserPage />} />
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
      <Route path="prompt/:promptId" element={<PromptPage />} />
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
      <Route path="prompts/:actionGroupId" element={<PromptProvidersPage />} />
    </Routes>
  )
}

const Home = () => <Outlet />

export const Switch = () => {
  const location = useLocation()
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  const authenticated = useAuthStore((s) => s.authenticated)
  const { saveNodeName } = useSaveNodeName()
  const { showSidebar, showAllSidebars, hideAllSidebars, hideRHSidebar, collapseAllSidebars } = useLayoutStore()

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  const fromSocket = useSocket()

  useEffect(() => {
    const editorNode = useEditorStore.getState().node
    // ? Do we need to save data locally on every route change?
    // mog('Changing location', { location })
    if (authenticated) {
      if (isBlockMode) setIsBlockMode(false)
      if (editorNode) saveNodeName(editorNode.nodeid)
      // saveEditorBuffer()
    }
    if (location.pathname) {
      if (location.pathname.startsWith(ROUTE_PATHS.snippets)) {
        // mog('Showing Sidebar', { location })
        fromSocket.sendJsonMessage({ action: SocketActionType.ROUTE_CHANGE, data: { route: location.pathname } })
        showSidebar()
        hideRHSidebar()
      } else if (location.pathname.startsWith(ROUTE_PATHS.node)) {
        fromSocket.sendJsonMessage({ action: SocketActionType.ROUTE_CHANGE, data: { route: location.pathname } })
        // mog('Showing Sidebar', { location })
        showAllSidebars()
      } else if (location.pathname.startsWith(ROUTE_PATHS.archive)) {
        hideAllSidebars()
        // hideRHSidebar()
      } else if (location.pathname.startsWith(ROUTE_PATHS.tasks)) {
        fromSocket.sendJsonMessage({ action: SocketActionType.ROUTE_CHANGE, data: { route: '' } })
        showSidebar()
        hideRHSidebar()
      } else if (location.pathname.startsWith(ROUTE_PATHS.reminders)) {
        showSidebar()
        hideRHSidebar()
      } else if (location.pathname.startsWith(ROUTE_PATHS.namespaceShare)) {
        showSidebar()
        hideRHSidebar()
      } else {
        // mog('Hiding all Sidebar', { location })
        hideAllSidebars()
      }
    }
  }, [location])

  useEffect(() => {
    if (overlaySidebar) {
      collapseAllSidebars()
    }
  }, [overlaySidebar])

  // mog('Rendering Switch', { location  })

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <SwitchWrapper $isAuth={authenticated}>
      <Routes>
        <Route path={`${ROUTE_PATHS.auth}/*`} element={<AuthRoutes />} />
        <Route path={`${ROUTE_PATHS.oauth}/:serviceName`} element={<OAuthRoute />} />
        <Route path={`${ROUTE_PATHS.actions}/*`} element={<ActionsRoutes />} />
        <Route path={`${ROUTE_PATHS.share}/:nodeId`} element={<PublicNodeView />} />
        <Route path={`${ROUTE_PATHS.namespaceShare}/:namespaceID`} element={<PublicNamespaceView />}>
          <Route path="node/:nodeId" element={<PublicNodeView />} />
        </Route>
        <Route
          path={ROUTE_PATHS.home}
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route index element={<DraftView />} />
          <Route path={`${ROUTE_PATHS.settings}/*`} element={<SettingsRoutes />} />
          <Route path={`${ROUTE_PATHS.snippets}/*`} element={<SnippetRoutes />} />
          <Route path={ROUTE_PATHS.search} element={<Search />} />
          <Route
            path={ROUTE_PATHS.links}
            element={
              <ProtectedRoute>
                <LinkView />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTE_PATHS.tasks} element={<Tasks />} />
          <Route path={`${ROUTE_PATHS.reminders}`} element={<RemindersAll />} />
          <Route path={`${ROUTE_PATHS.tasks}/:viewid`} element={<Tasks />} />
          <Route path={`${ROUTE_PATHS.tag}/:tag`} element={<Tag />} />
          <Route path={`${ROUTE_PATHS.integrations}/*`} element={<IntegrationRoutes />} />
        </Route>
        <Route
          path={ROUTE_PATHS.node}
          element={
            <ProtectedRoute>
              <EditorView />
            </ProtectedRoute>
          }
        >
          <Route path={`${ROUTE_PATHS.editor}/:nodeId`} element={<ContentEditor />} />
        </Route>
        <Route path={ROUTE_PATHS.archive} element={<Archive />} />
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </SwitchWrapper>
  )
}

export default Switch
