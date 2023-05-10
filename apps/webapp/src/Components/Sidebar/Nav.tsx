import React from 'react'
import { useLocation } from 'react-router-dom'

import archiveLine from '@iconify/icons-ri/archive-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import { useSingleton } from '@tippyjs/react'

import { NavTooltip, TitleWithShortcut } from '@workduck-io/mex-components'

import { useDataStore, useEditorStore, useHelpStore, useLayoutStore } from '@mexit/core'
import {
  ComingSoon,
  Count,
  EndLinkContainer,
  Link,
  MainLinkContainer,
  MainNav,
  NavTitle,
  NavWrapper,
  SideNav
} from '@mexit/shared'

import useNavlinks, { GetIcon } from '../../Data/links'
import useLayout from '../../Hooks/useLayout'
import { ROUTE_PATHS } from '../../Hooks/useRouting'
import { showNav } from '../../Utils/nav'
import { SidebarToggles } from '../logo'

import SidebarTabs from './SidebarTabs'
import { useSidebarTransition } from './Transition'
import WorkspaceSwitcher from './WorkspaceSwitcher'

const NavHeader: React.FC<{ target: any }> = ({ target }) => {
  const { getLinks } = useNavlinks()

  const links = getLinks()

  return (
    <MainLinkContainer onMouseUp={(e) => e.stopPropagation()}>
      {links.map((l) =>
        l.isComingSoon ? (
          <NavTooltip key={l.path} singleton={target} content={`${l.title} (Stay Tuned! 👀  )`}>
            <ComingSoon tabIndex={-1} key={`nav_${l.title}`}>
              {l.icon !== undefined ? l.icon : l.title}
            </ComingSoon>
          </NavTooltip>
        ) : (
          <NavTooltip
            key={l.path}
            singleton={target}
            content={l.shortcut ? <TitleWithShortcut title={l.title} shortcut={l.shortcut} /> : l.title}
          >
            <Link tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to={l.path} key={`nav_${l.title}`}>
              {l.icon !== undefined ? l.icon : l.title}
              <NavTitle>{l.title}</NavTitle>
            </Link>
          </NavTooltip>
        )
      )}
    </MainLinkContainer>
  )
}

const NavFooter: React.FC<{ target: any }> = ({ target }) => {
  const archive = useDataStore((store) => store.archive)
  const shortcuts = useHelpStore((store) => store.shortcuts)

  return (
    <EndLinkContainer onMouseUp={(e) => e.stopPropagation()}>
      <NavTooltip
        key={shortcuts.showArchive.title}
        singleton={target}
        content={<TitleWithShortcut title="Archive" shortcut={shortcuts.showArchive.keystrokes} />}
      >
        <Link tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to={ROUTE_PATHS.archive} key="nav_search">
          {GetIcon(archiveLine)}
          <NavTitle>Archive</NavTitle>
          {archive.length > 0 && <Count>{archive.length}</Count>}
        </Link>
      </NavTooltip>

      <NavTooltip
        key={shortcuts.showSettings.title}
        singleton={target}
        content={<TitleWithShortcut title="Settings" shortcut={shortcuts.showSettings.keystrokes} />}
      >
        <Link
          tabIndex={-1}
          className={(s) => (s.isActive ? 'active' : '')}
          to={`${ROUTE_PATHS.settings}`}
          key="nav_settings"
        >
          {GetIcon(settings4Line)}
          <NavTitle>Settings</NavTitle>
        </Link>
      </NavTooltip>
    </EndLinkContainer>
  )
}

const NavContent = () => {
  const focusMode = useLayoutStore((store) => store.focusMode)

  const location = useLocation()
  const { getFocusProps } = useLayout()
  const [source, target] = useSingleton()

  return (
    showNav(location.pathname) && (
      <MainNav {...getFocusProps(focusMode)}>
        <NavTooltip singleton={source} />

        <WorkspaceSwitcher />
        <NavHeader target={target} />
        <NavFooter target={target} />
      </MainNav>
    )
  )
}

const Nav = ({ children }) => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const isUserEditing = useEditorStore((state) => state.isEditing)
  const { getFocusProps } = useLayout()

  const location = useLocation()
  const onDoubleClickToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.detail === 2) {
      toggleSidebar()

      if (window && window.getSelection) {
        const sel = window.getSelection()
        sel.removeAllRanges()
      }
    }
  }

  const { springProps, overlaySidebar } = useSidebarTransition()

  return (
    <>
      <NavWrapper
        onMouseUp={(e) => onDoubleClickToggle(e)}
        $expanded={sidebar.expanded}
        $show={sidebar.show}
        {...getFocusProps(focusMode)}
      >
        {children}
        <SideNav
          onMouseUp={(e) => e.stopPropagation()}
          style={springProps}
          $expanded={sidebar.expanded}
          $show={sidebar.show}
          $isUserEditing={isUserEditing}
          $publicNamespace={location.pathname.startsWith(ROUTE_PATHS.namespaceShare)}
          $overlaySidebar={overlaySidebar}
          $side="left"
          {...getFocusProps(focusMode)}
        >
          <SidebarTabs />
        </SideNav>
      </NavWrapper>
    </>
  )
}

const NavContainer = () => {
  return (
    <Nav>
      <NavContent />
      <SidebarToggles />
    </Nav>
  )
}
export default NavContainer
