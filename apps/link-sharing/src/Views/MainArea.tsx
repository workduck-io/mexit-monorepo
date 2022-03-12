import React from 'react'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex: 1;
`

const MainArea = () => {
  return (
    <SentryErrorBoundary fallback={<p>An error has occurred</p>}>
      <Container>
        <Outlet />
      </Container>
    </SentryErrorBoundary>
  )
}

export default MainArea
