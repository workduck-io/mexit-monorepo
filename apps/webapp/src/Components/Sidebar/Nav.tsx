import React, { useEffect, useMemo, useState } from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveLine from '@iconify/icons-ri/archive-line'
import searchLine from '@iconify/icons-ri/search-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'
import tinykeys from 'tinykeys'

import {
  NavWrapper,
  NavTooltip,
  NavLogoWrapper,
  MainLinkContainer,
  CreateNewButton,
  NavTitle,
  ComingSoon,
  Count,
  EndLinkContainer,
  Link,
  SearchLink,
  MainNav,
  WDLogo,
  SideNav
} from '@mexit/shared'

import useNavlinks, { GetIcon } from '../../Data/links'
import { useCreateNewNode } from '../../Hooks/useCreateNewNode'
import useLayout from '../../Hooks/useLayout'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { useDataStore } from '../../Stores/useDataStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { SidebarToggles } from '../logo'
import NavigationCluster from './NavigationCluster'
import SidebarTabs from './SidebarTabs'
import { useSidebarTransition } from './Transition'

const CreateNewNote: React.FC<{ target: any }> = ({ target }) => {
  const { goTo } = useRouting()
  const { createNewNode } = useCreateNewNode()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    createNoteWithQABlock()
  }

  const createNoteWithQABlock = () => {
    // const qaContent = getRandomQAContent()
    const nodeId = createNewNode()

    goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
  }

  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.newNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.newNode, () => {
          createNoteWithQABlock()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
    <NavTooltip
      key={shortcuts.newNode.title}
      singleton={target}
      content={<TooltipTitleWithShortcut title="New Note" shortcut={shortcuts.newNode.keystrokes} />}
    >
      <CreateNewButton onClick={onNewNote}>
        <Icon icon={addCircleLine} />
      </CreateNewButton>
    </NavTooltip>
  )
}

const NavHeader: React.FC<{ target: any }> = ({ target }) => {
  const { getLinks } = useNavlinks()

  const links = getLinks()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  return (
    <MainLinkContainer onMouseUp={(e) => e.stopPropagation()}>
      <NavigationCluster />
      <CreateNewNote target={target} />
      <NavTooltip
        key={ROUTE_PATHS.search}
        singleton={target}
        content={<TooltipTitleWithShortcut title="Search" shortcut={shortcuts.showSearch.keystrokes} />}
      >
        <SearchLink
          tabIndex={-1}
          className={(s) => (s.isActive ? 'active' : '')}
          to={ROUTE_PATHS.search}
          key={`nav_search`}
        >
          {GetIcon(searchLine)}
        </SearchLink>
      </NavTooltip>
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
            content={l.shortcut ? <TooltipTitleWithShortcut title={l.title} shortcut={l.shortcut} /> : l.title}
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
        content={<TooltipTitleWithShortcut title="Archive" shortcut={shortcuts.showArchive.keystrokes} />}
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
        content={<TooltipTitleWithShortcut title="Settings" shortcut={shortcuts.showSettings.keystrokes} />}
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

const Nav = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const { getFocusProps } = useLayout()

  const [source, target] = useSingleton()

  const onDoubleClickToogle = (e: React.MouseEvent<HTMLDivElement>) => {
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
        onMouseUp={(e) => onDoubleClickToogle(e)}
        expanded={sidebar.expanded}
        show={sidebar.show}
        {...getFocusProps(focusMode)}
      >
        <MainNav {...getFocusProps(focusMode)}>
          <NavTooltip singleton={source} />

          <NavLogoWrapper>
            <WDLogo height={'56'} width={'56'} />
          </NavLogoWrapper>
          <NavHeader target={target} />
          <NavFooter target={target} />
        </MainNav>
        <SideNav
          onMouseUp={(e) => e.stopPropagation()}
          style={springProps}
          expanded={sidebar.expanded}
          show={sidebar.show}
          overlaySidebar={overlaySidebar}
          side="left"
          {...getFocusProps(focusMode)}
        >
          {/* Notes, Shared, Bookmarks */}
          <SidebarTabs />
        </SideNav>
      </NavWrapper>
      <SidebarToggles />
    </>
  )
}

export default Nav
