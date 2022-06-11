import { linkTooltip } from '@mexit/shared'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import * as Sentry from '@sentry/react'
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
  flex: 1;
  overflow: auto;
  /* ${({ grid }) =>
    grid &&
    css`
      grid-column-start: 2;
    `} */
`
export type MainProps = { children: React.ReactNode }

const Main = ({ children }: MainProps) => {
  const routingInstrumentation = useRoutingInstrumentation()
  useEffect(() => {
    if (!IS_DEV) {
      const browserTracing = new BrowserTracing({
        routingInstrumentation
      })

      Sentry.init({
        dsn: 'https://53b95f54a627459c8d0e74b9bef36381@o1135527.ingest.sentry.io/6184488',
        tracesSampleRate: 0.2,
        ignoreErrors: ['Warning', 'ResizeObserver', 'buildPlaceholders'],
        integrations: [browserTracing]
      })

      if (import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP && typeof import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP === 'string')
        Analytics.init(import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP)
    }
  }, [routingInstrumentation])

  const { getLinks } = useNavlinks()
  const location = useLocation()
  const authenticated = useAuthStore((state) => state.authenticated)
  const focusMode = useLayoutStore((s) => s.focusMode)

  const showNav = (): boolean => {
    if (location.pathname === '/') return true
    const showNavPaths = ['/editor', '/search', '/snippets', '/archive', '/tasks', '/settings', '/tag']

    for (const path of showNavPaths) {
      if (location.pathname.startsWith(path)) return true
    }

    return false
  }

  return (
    <AppWrapper className={focusMode.on ? 'focus_mode' : ''}>
      <GridWrapper
        // style={gridSpringProps}
        grid={authenticated && showNav() ? 'true' : 'false'}
      >
        {authenticated && showNav() && <Nav links={getLinks()} />}
        <Content id="wd-mex-content-view" grid={authenticated && showNav() ? true : false}>
          {children}
        </Content>
      </GridWrapper>
    </AppWrapper>
  )
}

export default Main
