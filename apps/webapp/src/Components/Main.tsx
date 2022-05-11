import { linkTooltip } from '@mexit/shared'
import { transparentize } from 'polished'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import { init as SentryInit } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { IS_DEV } from '@mexit/core'

import styled, { css } from 'styled-components'
import useNavlinks from '../Data/links'
import { useAuthStore } from '../Stores/useAuth'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { GridWrapper } from '../Style/Grid'
import { navTooltip } from '../Style/Nav'
import Analytics from '../Utils/analytics'
import Nav from './Sidebar/Nav'
import { useSidebarTransition } from './Sidebar/Transition'

const AppWrapper = styled.div`
  min-height: 100%;
  overflow: hidden;
  ${navTooltip};
  ${linkTooltip};
`

const Content = styled.div<{ grid?: boolean }>`
  display: flex;
  flex-grow: 1;
  overflow: auto;
  ${({ grid }) =>
    grid &&
    css`
      grid-column-start: 2;
    `}
`

const Draggable = styled.div`
  height: 24px;
  width: 100vw;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10000;

  &:hover,
  &:active {
    background-color: ${({ theme }) => transparentize(0.85, theme.colors.primary)};
  }
`

export type MainProps = { children: React.ReactNode }

const Main = ({ children }: MainProps) => {
  const routingInstrumentation = useRoutingInstrumentation()
  useEffect(() => {
    if (!IS_DEV) {
      const browserTracing = new BrowserTracing({
        routingInstrumentation
      })

      SentryInit({
        dsn: 'https://53b95f54a627459c8d0e74b9bef36381@o1135527.ingest.sentry.io/6184488',
        tracesSampleRate: 1.0,
        integrations: [browserTracing]
      })

      if (import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP && typeof import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP === 'string')
        Analytics.init(import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP)
    }
  }, [routingInstrumentation])

  const styles = {
    WebkitAppRegion: 'drag'
  }
  const { getLinks } = useNavlinks()
  const location = useLocation()
  const authenticated = useAuthStore((state) => state.authenticated)
  const focusMode = useLayoutStore((s) => s.focusMode)

  const { gridSpringProps } = useSidebarTransition()

  const showNav = (): boolean => {
    if (location.pathname === '/') return true
    const showNavPaths = ['/editor', '/search', '/snippets', '/archive', '/tasks', '/settings']

    for (const path of showNavPaths) {
      if (location.pathname.startsWith(path)) return true
    }

    return false
  }

  return (
    <AppWrapper className={focusMode.on ? 'focus_mode' : ''}>
      <GridWrapper style={gridSpringProps} grid={authenticated && showNav() ? 'true' : 'false'}>
        {authenticated && showNav() && <Nav links={getLinks()} />}
        <Content id="wd-mex-content-view" grid={authenticated && showNav() ? true : false}>
          {children}
        </Content>
      </GridWrapper>
    </AppWrapper>
  )
}

export default Main
