import React, { useEffect, useMemo } from 'react'

import { tinykeys } from '@workduck-io/tinykeys'

import { useAuthStore, useLayoutStore } from '@mexit/core'
import { Drawer, ExtInfobarMode, Group, InfoBarWrapper, LoginInfoBar, Tabs, WDLogo } from '@mexit/shared'

import { useRightSidebarShortcuts } from '../../Hooks/useRightSidebarShortcuts'
import { useSidebarTransition } from '../../Hooks/useSidebarTransition'
import { useRightSidebarItems } from '../../Stores/useRightSidebarItems'
import { getElementById } from '../../Utils/cs-utils'
import { RHSLogin } from '../Login'
import QuickActionsDrawer from '../QuickActionsDrawer'

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
      openedTab={infobar.mode ?? 'context'}
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
  const drawer = useLayoutStore((store) => store.drawer)
  const rhSidebar = useLayoutStore((store) => store.rhSidebar)
  const toggleExtensionSidebar = useLayoutStore((store) => store.toggleExtensionSidebar)
  const { rhSidebarSpringProps } = useSidebarTransition()
  const authenticated = useAuthStore((a) => a.authenticated)
  const infobar = useLayoutStore((s) => s.infobar)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Backslash': (e) => {
        e.stopPropagation()
        toggleExtensionSidebar()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  if (!rhSidebar?.show) return null

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
            <Drawer show={!!drawer}>
              <QuickActionsDrawer />
            </Drawer>
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
