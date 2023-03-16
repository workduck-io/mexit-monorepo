import React from 'react'
import { useMatch } from 'react-router-dom'

import { useLayoutStore } from '@mexit/core'
import { RHSideNav } from '@mexit/shared'

import useLayout from '../../Hooks/useLayout'
import { ROUTE_PATHS } from '../../Hooks/useRouting'
import { useSidebarTransition } from '../Sidebar/Transition'

import InfoBar from '.'

const RHSidebarContent = () => {
  const sidebar = useLayoutStore((store) => store.rhSidebar)
  const isEditor = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const isArchiveEditor = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)
  const isArchive = useMatch(ROUTE_PATHS.archive)

  if (!sidebar.show) return <></>

  if (isEditor) return <InfoBar />

  if (isArchive || isArchiveEditor) return <></>

  return <></>
}

const RHSidebar = () => {
  const { getFocusProps } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const rhSidebar = useLayoutStore((store) => store.rhSidebar)
  const { rhSidebarSpringProps, overlaySidebar } = useSidebarTransition()

  // mog('IS RHSIDEBAR', { rhSidebar })

  return (
    <RHSideNav
      style={rhSidebarSpringProps}
      $show={rhSidebar.show}
      $expanded={rhSidebar.expanded}
      $overlaySidebar={overlaySidebar}
      $side="right"
      $publicNamespace={false}
      {...getFocusProps(focusMode)}
    >
      <RHSidebarContent />
    </RHSideNav>
  )
}

export default RHSidebar
