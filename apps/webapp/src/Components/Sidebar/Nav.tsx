import archiveLine from '@iconify/icons-ri/archive-line'
import searchLine from '@iconify/icons-ri/search-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import {
  ComingSoon,
  Count,
  EndLinkContainer,
  Link,
  MainLinkContainer,
  MainNav,
  NavLogoWrapper,
  NavTitle,
  NavWrapper,
  SearchLink,
  SideNav,
  WDLogo
} from '@mexit/shared'
import { useSingleton } from '@tippyjs/react'
import { NavTooltip, TitleWithShortcut } from '@workduck-io/mex-components'
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import useNavlinks, { GetIcon } from '../../Data/links'
import useLayout from '../../Hooks/useLayout'
import { ROUTE_PATHS } from '../../Hooks/useRouting'
import { useAuthStore } from '../../Stores/useAuth'
import { useDataStore } from '../../Stores/useDataStore'
import { useEditorStore } from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { showNav } from '../../Utils/nav'
import { SidebarToggles } from '../logo'
import SidebarTabs from './SidebarTabs'
import { useSidebarTransition } from './Transition'

// const CreateNewNote: React.FC<{ target: any }> = ({ target }) => {
//   const { goTo } = useRouting()
//   const { createNewNote } = useCreateNewNote()
//   const shortcuts = useHelpStore((store) => store.shortcuts)

//   const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
//     e.preventDefault()
//     createNoteWithQABlock()
//   }

//   const createNoteWithQABlock = () => {
//     // const qaContent = getRandomQAContent()
//     const nodeId = createNewNote()

//     goTo(ROUTE_PATHS.node, NavigationType.push, nodeId?.nodeid)
//   }

//   const { shortcutHandler } = useKeyListener()

//   useEffect(() => {
//     const unsubscribe = tinykeys(window, {
//       [shortcuts.newNode.keystrokes]: (event) => {
//         event.preventDefault()
//         shortcutHandler(shortcuts.newNode, () => {
//           createNoteWithQABlock()
//         })
//       }
//     })
//     return () => {
//       unsubscribe()
//     }
//   }, [shortcuts])

//   return (
//     <NavTooltip
//       key={shortcuts.newNode.title}
//       singleton={target}
//       content={<TitleWithShortcut title="New Note" shortcut={shortcuts.newNode.keystrokes} />}
//     >
//       <CreateNewButton onClick={onNewNote}>
//         <Icon icon={addCircleLine} />
//       </CreateNewButton>
//     </NavTooltip>
//   )
// }

const NavHeader: React.FC<{ target: any }> = ({ target }) => {
  const { getLinks } = useNavlinks()

  const links = getLinks()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  return (
    <MainLinkContainer onMouseUp={(e) => e.stopPropagation()}>
      <NavTooltip
        key={ROUTE_PATHS.search}
        singleton={target}
        content={<TitleWithShortcut title="Search" shortcut={shortcuts.showSearch.keystrokes} />}
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

const Nav = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const isUserEditing = useEditorStore((state) => state.isEditing)
  const { getFocusProps } = useLayout()
  const authenticated = useAuthStore((state) => state.authenticated)

  const [source, target] = useSingleton()
  const shortcuts = useHelpStore((store) => store.shortcuts)

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
        {authenticated && showNav(location.pathname) && (
          <MainNav {...getFocusProps(focusMode)}>
            <NavTooltip singleton={source} />

            <NavTooltip key={shortcuts.showHome.title} singleton={target} content={<TitleWithShortcut title="Home" />}>
              <NavLogoWrapper>
                <NavLink to={ROUTE_PATHS.home}>
                  <WDLogo height={'56'} width={'56'} />
                </NavLink>
              </NavLogoWrapper>
            </NavTooltip>
            <NavHeader target={target} />
            <NavFooter target={target} />
          </MainNav>
        )}
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
          {/* Notes, Shared, Bookmarks */}
          <SidebarTabs />
        </SideNav>
      </NavWrapper>
      <SidebarToggles />
    </>
  )
}

export default Nav
