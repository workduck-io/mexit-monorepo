import React from 'react'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'
import Sidebar from '../Components/Sidebar/Sidebar'
import { useTreeFromLinks } from '../Stores/useDataStore'
import InfoBar from '../Components/Infobar'

const EditorViewWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`


const MainArea = () => {
  const Tree = useTreeFromLinks()

  return (
    <EditorViewWrapper>
      <Sidebar tree={Tree} starred={Tree} />
      <SentryErrorBoundary fallback={<p>An error has occurred</p>}>
        <Outlet />
      </SentryErrorBoundary>
      <InfoBar />
    </EditorViewWrapper>
  )
}

export default MainArea
