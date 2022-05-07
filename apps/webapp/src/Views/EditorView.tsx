import React from 'react'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'
import InfoBar from '../Components/Infobar'
import Init from '../Components/Init'

const EditorViewWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`

const EditorView = () => {
  return (<>
    <Init />
    <EditorViewWrapper>
      <SentryErrorBoundary fallback={<p>An error has occurred</p>}>
        <Outlet />
      </SentryErrorBoundary>
      <InfoBar />
    </EditorViewWrapper>
  </>
  )
}

export default EditorView
