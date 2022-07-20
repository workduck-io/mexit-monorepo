import React from 'react'
import { useMatch } from 'react-router-dom'

import { defaultContent, mog } from '@mexit/core'
import { SideNav } from '@mexit/shared'

import InfoBar from '.'
import useLayout from '../../Hooks/useLayout'
import { ROUTE_PATHS } from '../../Hooks/useRouting'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useSidebarTransition } from '../Sidebar/Transition'
import PublicDataInfobar from './PublicNodeInfobar'

const RHSidebarContent = () => {
  const sidebar = useLayoutStore((store) => store.rhSidebar)
  const isEditor = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const isArchiveEditor = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)
  const isArchive = useMatch(ROUTE_PATHS.archive)
  const isPublicView = useMatch(`${ROUTE_PATHS.share}/:nodeid`)

  console.log('publick', isPublicView)
  if (!sidebar.show) return <></>

  if (isEditor) return <InfoBar />

  if (isArchive || isArchiveEditor) return <></>

  return <></>
}

const RHSidebar = () => {
  const { getFocusProps } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const rhSidebar = useLayoutStore((store) => store.rhSidebar)
  const { rhSidebarSpringProps } = useSidebarTransition()

  mog('IS RHSIDEBAR', { rhSidebar })

  return (
    <SideNav
      style={rhSidebarSpringProps}
      show={rhSidebar.show}
      expanded={rhSidebar.expanded}
      {...getFocusProps(focusMode)}
    >
      <RHSidebarContent />
    </SideNav>
  )
}

export default RHSidebar
