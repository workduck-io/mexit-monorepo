import React, { useMemo } from 'react'

import { useAuthStore, useLayoutStore } from '@mexit/core'
import { ExtInfobarMode, Group, InfoBarWrapper, LoginInfoBar, Tabs, WDLogo } from '@mexit/shared'

import { useRightSidebarShortcuts } from '../../Hooks/useRightSidebarShortcuts'
import { useSidebarTransition } from '../../Hooks/useSidebarTransition'
import { useRightSidebarItems } from '../../Stores/useRightSidebarItems'
import { getElementById } from '../../Utils/cs-utils'
import { RHSLogin } from '../Login'

import { DraggableToggle } from './DraggableToggle'
import { ExtensionHeaderStyled, ExtSideNav, SidebarContainer, SubHeading } from './styled'

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

const ExtensionHeader = () => {
  return (
    <ExtensionHeaderStyled>
      <Group>
        <WDLogo height={'28'} width={'28'} />
        <SubHeading>Mex</SubHeading>
      </Group>
    </ExtensionHeaderStyled>
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
            <ExtensionHeader />
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
