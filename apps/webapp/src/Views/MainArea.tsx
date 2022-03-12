import React from 'react'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'
import Sidebar from '../Components/Sidebar/Sidebar'
import { useTreeFromLinks } from '../Stores/useDataStore'

const Container = styled.div`
  display: flex;
  flex: 1;
`

const MainArea = () => {
  const Tree = useTreeFromLinks()

  return (
    <SentryErrorBoundary fallback={<p>An error has occurred</p>}>
      <Container>
        <Sidebar tree={Tree} starred={Tree} />
        <Outlet />
      </Container>
    </SentryErrorBoundary>
  )
}

export default MainArea
