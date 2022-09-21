import React from 'react'

import { Route, Routes } from 'react-router-dom'
import { animated } from 'react-spring'
import styled from 'styled-components'

import RouteNotFound from './Components/404'
import DownForMaintenance from './Components/DownForMaintenance'
import GenericOAuthRedirect from './Components/OAuth/GenericOAuthRedirect'
import { ROUTE_PATHS } from './Hooks/useRouting'

export const SwitchWrapper = styled(animated.div)`
  height: 100%;

  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

const OAuthRoute = () => {
  return <GenericOAuthRedirect />
}

export const Switch = () => {
  return (
    // eslint-disable-next-line
    // @ts-ignore
    <SwitchWrapper>
      <Routes>
        <Route path={`${ROUTE_PATHS.oauth}/:serviceName`} element={<OAuthRoute />} />
        <Route path={`/*`} element={<DownForMaintenance />}></Route>
        <Route path="*" element={<RouteNotFound />} />
      </Routes>
    </SwitchWrapper>
  )
}

export default Switch
