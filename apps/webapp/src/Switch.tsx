import { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { animated } from 'react-spring'

import styled from 'styled-components'

import { AppInitStatus, useAuthStore, useBlockStore, useEditorStore, useLayoutStore } from '@mexit/core'
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
import Search from './Views/Search'
import Settings from './Views/Settings'
import About from './Views/Settings/About'
import Invite from './Views/Settings/Invite'
import Shortcuts from './Views/Settings/Shortcuts'
import Snippets from './Views/Snippets'
import Tag from './Views/Tag'
import ViewPage from './Views/ViewPage'
import JoinWorkspace from './Views/Workspace/Join'
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
        <Route path="invite" element={<Invite />} />
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

const ViewRoutes = () => {
  return (
    <Routes>
      <Route index element={<ViewPage />} />
      <Route path=":viewid" element={<ViewPage />} />
    </Routes>
  )
}

export const Switch = ({ children }) => {
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

    if (authenticated) {
      if (isBlockMode) setIsBlockMode(false)
      if (editorNode) saveNodeName(editorNode.nodeid)
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
      } else if (location.pathname.startsWith(ROUTE_PATHS.view)) {
        fromSocket.sendJsonMessage({ action: SocketActionType.ROUTE_CHANGE, data: { route: '' } })
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
    // @ts-ignore
    <SwitchWrapper $isAuth={authenticated}>{children}</SwitchWrapper>
  )
}

const JoinWorkspaceRoutes = () => {
  return (
    <Routes>
      <Route path="join" element={<JoinWorkspace />} />
    </Routes>
  )
}

const PageRoutes = () => {
  return (
    <Switch>
      <Routes>
        <Route path={`${ROUTE_PATHS.auth}/*`} element={<AuthRoutes />} />
        <Route path={`${ROUTE_PATHS.workspace}/*`} element={<JoinWorkspaceRoutes />} />
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
          <Route path={`${ROUTE_PATHS.view}/*`} element={<ViewRoutes />} />
          <Route path={ROUTE_PATHS.search} element={<Search />} />
          <Route path={ROUTE_PATHS.links} element={<LinkView />} />
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
    </Switch>
  )
}

export default PageRoutes
