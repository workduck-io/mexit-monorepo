import React, { useEffect } from 'react'
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react'
import { client } from '@workduck-io/dwindle'
import { Outlet } from 'react-router-dom'

import styled from 'styled-components'
import Sidebar from '../Components/Sidebar/Sidebar'
import useDataStore, { useTreeFromLinks } from '../Stores/useDataStore'
import { Button } from '@mexit/shared'

const Container = styled.div`
  display: flex;
  flex: 1;
`

const MainArea = () => {
  const setILinks = useDataStore((store) => store.setIlinks)

  useEffect(() => {
    const ilinks = [
      {
        path: 'doc',
        nodeid: 'NODE_pgNXymywCdMqGCpmED3U9'
      },
      {
        path: 'dev',
        nodeid: 'NODE_6imUwDyYhgm7mUKx9WWXg'
      },
      {
        path: 'design',
        nodeid: 'NODE_Qxmbcc6U4bdfMrGG7nVm8'
      },
      {
        path: '@',
        nodeid: 'NODE_zdgDPT3rw69pL8GtyytM9'
      },
      {
        path: 'Draft',
        nodeid: 'NODE_AyWJeFYDW6GNH4CAEXcLG',
        icon: 'ri:draft-line'
      },
      {
        path: 'Tasks',
        nodeid: 'NODE_kdaPNyJDDHDPkULmctdCn',
        icon: 'ri:task-line'
      }
    ]
    setILinks(ilinks)
  }, [])

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
