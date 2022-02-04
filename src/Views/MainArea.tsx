import React from 'react'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'

import Editor from '../Components/Editor/Editor'
import styled from 'styled-components'
import Sidebar from '../Components/Sidebar'

const Container = styled.div`
  display: flex;
  flex: 1;
`

function MainArea() {
  return (
    <SentryErrorBoundary fallback={<p>An error has occurred</p>}>
      <Container>
        <Sidebar />
        <Editor />
      </Container>
    </SentryErrorBoundary>
  )
}

export default MainArea
