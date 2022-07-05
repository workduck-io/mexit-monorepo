import React, { useEffect, useMemo, useState } from 'react'
import tinykeys from 'tinykeys'
import { useSingleton } from '@tippyjs/react'
import { Icon } from '@iconify/react'
import archiveFill from '@iconify/icons-ri/archive-fill'
import gitBranchLine from '@iconify/icons-ri/git-branch-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import bookmark3Line from '@iconify/icons-ri/bookmark-3-line'
import shareLine from '@iconify/icons-ri/share-line'

import {
  NavWrapper,
  NavTooltip,
  NavLogoWrapper,
  MainLinkContainer,
  CreateNewButton,
  NavTitle,
  ComingSoon,
  Count,
  NavDivider,
  EndLinkContainer,
  Link,
  NavSpacer,
  MexIcon,
  SharedNodeIcon
} from '@mexit/shared'

import { TooltipTitleWithShortcut } from '../Shortcuts'
import { useSidebarTransition } from './Transition'
import Tree, { TreeContainer } from './Tree'
import { BookmarksHelp, TreeHelp, SharedHelp } from '../../Data/defaultText'
import useLayout from '../../Hooks/useLayout'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import Collapse from '../../Layout/Collapse'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import { Logo, SidebarToggle, TrafficLightBG } from '../logo'
import { GetIcon } from '../../Data/links'
import { NavProps } from '../../Types/Nav'
import { useInternalLinks } from '../../Hooks/useInternalLinks'
import { useCreateNewNode } from '../../Hooks/useCreateNewNode'
import { useTreeFromLinks } from '../../Hooks/useTreeFromLinks'
import { useLinks } from '../../Hooks/useLinks'
import Bookmarks from './Bookmarks'
import SharedNotes from './SharedNotes'
import { useTheme } from 'styled-components'
import { useBookmarks } from '../../Hooks/useBookmarks'
import Tabs from '../../Views/Tabs'
import { useDataStore } from '../../Stores/useDataStore'
import { usePolling } from '../../Hooks/API/usePolling'

const Nav = ({ links }: NavProps) => {
  // const match = useMatch(`/${ROUTE_PATHS.node}/:nodeid`)
  const initTree = useTreeFromLinks()
  const sidebar = useLayoutStore((store) => store.sidebar)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const { getFocusProps } = useLayout()
  const { getLinkCount } = useLinks()
  const { goTo } = useRouting()
  const { createNewNode } = useCreateNewNode()
  const theme = useTheme()

  const [source, target] = useSingleton()

  const [openedTab, setOpenedTab] = useState<number>(0)
  const { getAllBookmarks } = useBookmarks()

  usePolling()

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault()
    const nodeId = await createNewNode()
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
  }

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.newNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.newNode, async () => {
          const nodeid = await createNewNode()

          goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts]) // eslint-disable-line

  useEffect(() => {
    getAllBookmarks()
  }, [])

  const { springProps } = useSidebarTransition()

  const archiveCount = getLinkCount().archive

  const tabs = useMemo(
    () => [
      {
        label: <MexIcon $noHover icon="ri:draft-line" width={20} height={20} />,
        key: 'wd-mex-all-notes-tree',
        component: <TreeContainer />,
        tooltip: 'All Notes'
      },
      {
        label: <SharedNodeIcon fill={theme.colors.text.heading} height={18} width={18} />,
        key: 'wd-mex-shared-notes',
        component: <SharedNotes />,
        tooltip: 'Shared Notes'
      },
      {
        label: <MexIcon $noHover icon="ri:bookmark-line" width={20} height={20} />,
        key: 'wd-mex-bookmarks',
        component: <Bookmarks />,
        tooltip: 'Bookmarks'
      }
    ],
    []
  )

  return (
    <>
      {/* eslint-disable-next-line */}
      {/* @ts-ignore */}
      <NavWrapper style={springProps} $expanded={sidebar.expanded} {...getFocusProps(focusMode)}>
        <NavTooltip singleton={source} />
        <NavLogoWrapper onClick={() => goTo(ROUTE_PATHS.home, NavigationType.push)}>
          <Logo />
        </NavLogoWrapper>
        <MainLinkContainer>
          <NavTooltip
            key={shortcuts.newNode.title}
            singleton={target}
            content={<TooltipTitleWithShortcut title="New Note" shortcut={shortcuts.newNode.keystrokes} />}
          >
            <CreateNewButton onClick={onNewNote}>
              <Icon icon="fa6-solid:file-pen" />
              <NavTitle>Create New Note</NavTitle>
            </CreateNewButton>
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
                  <>
                    {l.icon !== undefined ? l.icon : l.title}
                    <NavTitle>{l.title}</NavTitle>
                    {l.count > 0 && <Count>{l.count}</Count>}
                  </>
                </Link>
              </NavTooltip>
            )
          )}
        </MainLinkContainer>
        {/* Notes, Shared, Bookmarks */}
        <Tabs visible={sidebar.expanded} openedTab={openedTab} onChange={setOpenedTab} tabs={tabs} />
        {/* 
        <Collapse
          title="Bookmarks"
          oid="bookmarks"
          icon={bookmark3Line}
          maximumHeight="30vh"
          infoProps={{
            text: BookmarksHelp
          }}
        >
          <Bookmarks />
        </Collapse>
        <Collapse
          title="Shared Notes"
          oid="sharednotes"
          icon={shareLine}
          maximumHeight="30vh"
          infoProps={{
            text: SharedHelp
          }}
        >
          <SharedNotes />
        </Collapse>
        <Collapse
          title="All Notes"
          oid={`tree`}
          defaultOpen
          icon={gitBranchLine}
          maximumHeight="80vh"
          infoProps={{
            text: TreeHelp
          }}
        >
          <Tree initTree={initTree} />
        </Collapse>

        <NavSpacer />
        <NavDivider />
 */}
        <EndLinkContainer onMouseUp={(e) => e.stopPropagation()}>
          {/* {authenticated ? (
          <NavTooltip singleton={target} content="User">
            <Link  tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to="/user" key="nav_user">
              {GetIcon(user3Line)}
            </Link>
          </NavTooltip>
        ) : (
          <NavTooltip singleton={target} content="Login">
            <Link tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to={ROUTE_PATHS.login} key="nav_user" className="active">
              {GetIcon(lockPasswordLine)}
            </Link>
          </NavTooltip>
        )} */}
          <NavTooltip
            key={shortcuts.showArchive.title}
            singleton={target}
            content={<TooltipTitleWithShortcut title="Archive" shortcut={shortcuts.showArchive.keystrokes} />}
          >
            <Link
              tabIndex={-1}
              className={(s) => (s.isActive ? 'active' : '')}
              to={ROUTE_PATHS.archive}
              key="nav_search"
            >
              {GetIcon(archiveFill)}
              <NavTitle>Archive</NavTitle>
              {archiveCount > 0 && <Count>{archiveCount}</Count>}
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
      </NavWrapper>
      <SidebarToggle />
    </>
  )
}

export default Nav
