import React, { useMemo } from 'react'

import { ExtInfobarMode, InfoBarWrapper, LoginInfoBar, Tabs } from '@mexit/shared'

import { useAuthStore } from '../../Hooks/useAuth'
import { useRightSidebarShortcuts } from '../../Hooks/useRightSidebarShortcuts'
import { useSidebarTransition } from '../../Hooks/useSidebarTransition'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { useRightSidebarItems } from '../../Stores/useRightSidebarItems'
import { getElementById } from '../../Utils/cs-utils'
import { RHSLogin } from '../Login'

import { DraggableToggle } from './DraggableToggle'
import { ExtSideNav, SidebarContainer } from './styled'

const ExtInfoBarItems = () => {
  const { getRHSTabs } = useRightSidebarItems()
  const tabs = useMemo(() => getRHSTabs(), [])

  const infobar = useLayoutStore((s) => s.infobar)
  const setInfobarMode = useLayoutStore((s) => s.setInfobarMode)

  useRightSidebarShortcuts()

  return (
    <Tabs
      visible={true}
      openedTab={infobar.mode}
      root={getElementById('ext-side-nav')}
      onChange={(tab) => {
        setInfobarMode(tab as ExtInfobarMode)
      }}
      tabs={tabs}
    />
  )
}

export const ExtInfoBar = () => {
  const { rhSidebar } = useLayoutStore()
  const { rhSidebarSpringProps } = useSidebarTransition()
  const authenticated = useAuthStore((a) => a.authenticated)
  const infobar = useLayoutStore((s) => s.infobar)

  return (
    <SidebarContainer id="ext-side-nav">
      <ExtSideNav
        style={rhSidebarSpringProps}
        $show={rhSidebar.show}
        $expanded={rhSidebar.expanded}
        $overlaySidebar={false}
        $side="right"
        $publicNamespace={false}
      >
        {authenticated ? (
          <InfoBarWrapper mode={infobar.mode}>
            <ExtInfoBarItems />
          </InfoBarWrapper>
        ) : (
          <LoginInfoBar mode={infobar.mode}>
            <RHSLogin />
          </LoginInfoBar>
        )}
      </ExtSideNav>
      <DraggableToggle />
    </SidebarContainer>
  )
}
