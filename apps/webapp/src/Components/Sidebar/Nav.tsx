import archiveFill from '@iconify/icons-ri/archive-fill'
import gitBranchLine from '@iconify/icons-ri/git-branch-line'
import settings4Line from '@iconify/icons-ri/settings-4-line'
import { Icon } from '@iconify/react'
import { useSingleton } from '@tippyjs/react'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import tinykeys from 'tinykeys'
import { TooltipTitleWithShortcut } from '../Shortcuts'
import { useSidebarTransition } from './Transition'
import Bookmarks from './Bookmarks'
import bookmark3Line from '@iconify/icons-ri/bookmark-3-line'
import Tree from './Tree'
import { NavTooltip } from '@mexit/shared'
import { BookmarksHelp, TreeHelp } from '../../Data/defaultText'
import { useApi } from '../../Hooks/useApi'
import useLayout from '../../Hooks/useLayout'
import { useLinks } from '../../Hooks/useLinks'
import useLoad from '../../Hooks/useLoad'
import { useNavigation } from '../../Hooks/useNavigation'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../Hooks/useRouting'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import Collapse from '../../Layout/Collapse'
import { useAuthStore } from '../../Stores/useAuth'
import useDataStore, { useTreeFromLinks } from '../../Stores/useDataStore'
import useEditorStore from '../../Stores/useEditorStore'
import { useHelpStore } from '../../Stores/useHelpStore'
import { useLayoutStore } from '../../Stores/useLayoutStore'
import {
  NavWrapper,
  NavLogoWrapper,
  MainLinkContainer,
  CreateNewButton,
  NavTitle,
  ComingSoon,
  Count,
  NavDivider,
  EndLinkContainer,
  Link
} from '../../Style/Nav'
import { Logo, SidebarToggle } from '../logo'
import { GetIcon } from '../../Data/links'
import { NavProps } from '../../Types/Nav'
import { getUntitledDraftKey } from '@mexit/core'
import { useInternalLinks } from '../../Data/useInternalLinks'

const Nav = ({ links }: NavProps) => {
  // const match = useMatch(`/${ROUTE_PATHS.node}/:nodeid`)
  const initTree = useTreeFromLinks()
  const authenticated = useAuthStore((store) => store.authenticated)
  const sidebar = useLayoutStore((store) => store.sidebar)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const focusMode = useLayoutStore((store) => store.focusMode)
  const addILink = useDataStore((store) => store.addILink)
  const { push } = useNavigation()
  const { saveNewNodeAPI } = useApi()
  const { getFocusProps } = useLayout()
  const { getLinkCount } = useLinks()
  const { goTo } = useRouting()
  const { saveNodeName } = useLoad()

  const [source, target] = useSingleton()
  const { refreshILinks } = useInternalLinks()

  useEffect(() => {
    refreshILinks()
    const interval = setInterval(() => {
      refreshILinks()
    }, 120000)
    return () => clearInterval(interval)
  }, [])

  const createNewNode = () => {
    const newNodeId = getUntitledDraftKey()
    const node = addILink({ ilink: newNodeId, showAlert: false })

    if (node === undefined) {
      toast.error('The node clashed')
      return
    }

    saveNodeName(useEditorStore.getState().node.nodeid)
    saveNewNodeAPI(node.nodeid)
    push(node.nodeid, { withLoading: false })
    // appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)

    return node.nodeid
  }

  const onNewNote: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    const nodeid = createNewNode()

    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.newNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.newNode, () => {
          const nodeid = createNewNode()

          goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts]) // eslint-disable-line

  const { springProps } = useSidebarTransition()

  const archiveCount = getLinkCount().archive

  // useEffect(() => {
  //   refreshILinks()
  //   const interval = setInterval(() => {
  //     refreshILinks()
  //   }, 3600000)
  //   return () => clearInterval(interval)
  // }, []) // eslint-disable-line

  return (
    <NavWrapper style={springProps} $expanded={sidebar.expanded} {...getFocusProps(focusMode)}>
      <NavTooltip singleton={source} />

      <NavLogoWrapper>
        <Logo />
        <SidebarToggle />
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
                {l.icon !== undefined ? l.icon : l.title}
                <NavTitle>{l.title}</NavTitle>
                {l.count > 0 && <Count>{l.count}</Count>}
              </Link>
            </NavTooltip>
          )
        )}
      </MainLinkContainer>

      {/* <Collapse
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
 */}
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

      <NavDivider />

      <EndLinkContainer>
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
          <Link tabIndex={-1} className={(s) => (s.isActive ? 'active' : '')} to={ROUTE_PATHS.archive} key="nav_search">
            {GetIcon(archiveFill)}
            <NavTitle>Archive</NavTitle>
            {archiveCount > 0 && <Count>{archiveCount}</Count>}
          </Link>
        </NavTooltip>
        {/*
        <NavButton onClick={toggleSidebar}>
          <Icon icon={sidebar.expanded ? menuFoldLine : menuUnfoldLine} />
          <NavTitle>{sidebar.expanded ? 'Collapse' : 'Expand'}</NavTitle>
        </NavButton>
         */}

        <NavTooltip
          key={shortcuts.showSettings.title}
          singleton={target}
          content={<TooltipTitleWithShortcut title="Settings" shortcut={shortcuts.showSettings.keystrokes} />}
        >
          <Link
            tabIndex={-1}
            className={(s) => (s.isActive ? 'active' : '')}
            to={`${ROUTE_PATHS.settings}/themes`}
            key="nav_settings"
          >
            {GetIcon(settings4Line)}
            <NavTitle>Settings</NavTitle>
          </Link>
        </NavTooltip>
      </EndLinkContainer>
    </NavWrapper>
  )
}

export default Nav
