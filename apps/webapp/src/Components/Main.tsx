import React, { useEffect } from 'react'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { transparentize } from 'polished'
import useRoutingInstrumentation from 'react-router-v6-instrumentation'
import styled from 'styled-components'

import { IS_DEV } from '@mexit/core'
import { linkTooltip } from '@mexit/shared'
import { GridWrapper } from '@mexit/shared'
import { navTooltip } from '@mexit/shared'

import { useAuthStore } from '../Stores/useAuth'
import { useLayoutStore } from '../Stores/useLayoutStore'
import RHSidebar from './Infobar/RHSidebar'
import Nav from './Sidebar/Nav'
import { useSidebarTransition } from './Sidebar/Transition'

const AppWrapper = styled.div`
  min-height: 100%;
  overflow: hidden;
  ${navTooltip};
  ${linkTooltip};
`

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  grid-column-start: 2;
`

export type MainProps = { children: React.ReactNode }

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

      // if (import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP && typeof import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP === 'string')
      // Analytics.init(import.meta.env.VITE_MIXPANEL_TOKEN_WEBAPP)
    }
  }, [routingInstrumentation])

  const isGettingIntialized = useLayoutStore((store) => store.showLoader)
  const authenticated = useAuthStore((state) => state.authenticated)
  const focusMode = useLayoutStore((s) => s.focusMode)

  const styles = {
    WebkitAppRegion: 'drag'
  }

  const { gridSpringProps } = useSidebarTransition()

  const initialized = !isGettingIntialized && authenticated

  return (
    <AppWrapper className={focusMode.on ? 'focus_mode' : ''}>
      {/* <Draggable style={styles as any} /> eslint-disable-line @typescript-eslint/no-explicit-any */}
      <GridWrapper
        style={gridSpringProps}
        // eslint-disable-next-line
        // @ts-ignore
        // grid={authenticated && showNav() ? 'true' : 'false'}
      >
        {!isGettingIntialized && <Nav />}
        <Content id="wd-mex-content-view">{children}</Content>

        {initialized && <RHSidebar />}
      </GridWrapper>
    </AppWrapper>
  )
}

export default Main
