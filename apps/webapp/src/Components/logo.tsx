import React, { useEffect } from 'react'

import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import styled, { css, useTheme } from 'styled-components'

import { TitleWithShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { FocusModeProp, focusStyles } from '@mexit/shared'

import useLayout from '../Hooks/useLayout'
import { useKeyListener } from '../Hooks/useShortcutListener'
import { useHelpStore } from '../Stores/useHelpStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { useSidebarTransition } from './Sidebar/Transition'

const LogoWrapper = styled.div<{ expanded: boolean }>`
  ${({ expanded }) => (expanded ? 'width: 100%;' : 'width: 40px;')}
`

export const Logo = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const theme = useTheme()

  return (
    <LogoWrapper expanded={sidebar.expanded}>
      <svg height="32" viewBox="0 0 32 32" fill={theme.colors.primary} xmlns="http://www.w3.org/2000/svg">
        <path d="M6.73943 11.6292C3.7743 10.8513 2.21681 9.72041 0 6.17839C2.35657 18.2186 5.8755 23.1172 13.6727 27.0941C9.73444 21.9698 7.43539 17.8271 6.73943 11.6292Z" />
        <path d="M17.9045 31.3889C12.424 23.4841 9.25471 14.4759 9.25471 5.43732C11.2611 8.58421 12.5942 9.56617 15.2604 10.6954C16.0504 15.6543 18.5564 20.2029 21.758 24.0325C20.5808 26.9418 19.915 28.0831 17.9045 31.3889Z" />
        <path d="M22.5694 21.7885C24.1654 16.2449 24.7585 11.7113 25 5C23.0615 8.75546 21.4815 10.3266 18.7432 11.2846C19.0679 14.3424 20.6559 19.3817 22.5694 21.7885Z" />
      </svg>
    </LogoWrapper>
  )
}

interface SidebarToggleWrappperProps extends FocusModeProp {
  expanded: boolean
  show: boolean
  side: 'right' | 'left'
  endColumnWidth?: string
}

export const SidebarToggleWrapper = styled.div<SidebarToggleWrappperProps>`
  position: absolute;
  ${(props) => focusStyles(props)}
  ${({ expanded, side, theme, endColumnWidth }) =>
    side === 'left'
      ? expanded
        ? css`
            top: ${theme.additional.hasBlocks ? 67 : 64}px;
            left: ${theme.additional.hasBlocks ? 359 : 346}px;
          `
        : css`
            top: ${theme.additional.hasBlocks ? 67 : 64}px;
            left: ${theme.additional.hasBlocks ? 86 : 70}px;
          `
      : expanded
      ? css`
          top: ${theme.additional.hasBlocks ? 67 : 64}px;
          right: calc(${(endColumnWidth ?? '400px') + ' + ' + (theme.additional.hasBlocks ? 0 : -15)}px);
        `
      : css`
          top: ${theme.additional.hasBlocks ? 67 : 64}px;
          right: ${theme.additional.hasBlocks ? 8 : 8}px;
        `}

  transition: left 0.5s ease, top 0.5s ease, right 0.5s ease, background 0.5s ease, box-shadow 0.5s ease;
  z-index: 11;
  padding: 8px;
  display: flex;
  align-items: center;
  border-radius: 100%;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text.oppositePrimary};

  ${({ show }) =>
    !show &&
    css`
      display: none;
    `}

  &:hover {
    cursor: pointer;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
    background: ${({ theme }) => theme.colors.secondary};
  }

  &:active {
    transition: background 0.1s ease;
    background-color: ${({ theme }) => theme.colors.primary};
  }
`

export const TrafficLightBG = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 86px;
  height: 32px;
  background-color: transparent;
  opacity: 0.9;
  z-index: 10000;
  border-radius: 0 0 10px;
`

export const SidebarToggles = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const rhSidebar = useLayoutStore((state) => state.rhSidebar)

  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const toggleRHSidebar = useLayoutStore((store) => store.toggleRHSidebar)
  const toggleAllSidebars = useLayoutStore((store) => store.toggleAllSidebars)

  /** Set shortcuts */
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  const focusMode = useLayoutStore((state) => state.focusMode)
  const { getFocusProps } = useLayout()
  const { endColumnWidth } = useSidebarTransition()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleSidebar.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showSnippets, () => {
          toggleAllSidebars()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Tippy
        theme="mex-bright"
        placement="right"
        content={<TitleWithShortcut title={sidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
      >
        <SidebarToggleWrapper
          side="left"
          onClick={toggleSidebar}
          expanded={sidebar.expanded}
          show={sidebar.show}
          {...getFocusProps(focusMode)}
        >
          <Icon
            icon={sidebar.expanded ? 'heroicons-solid:chevron-double-left' : 'heroicons-solid:chevron-double-right'}
          />
        </SidebarToggleWrapper>
      </Tippy>
      <Tippy
        theme="mex-bright"
        placement="left"
        content={<TitleWithShortcut title={rhSidebar.expanded ? 'Collapse Cooler Sidebar' : 'Expand Cooler Sidebar'} />}
      >
        <SidebarToggleWrapper
          side="right"
          onClick={toggleRHSidebar}
          expanded={rhSidebar.expanded}
          show={rhSidebar.show}
          endColumnWidth={endColumnWidth}
          {...getFocusProps(focusMode)}
        >
          <Icon
            icon={rhSidebar.expanded ? 'heroicons-solid:chevron-double-right' : 'heroicons-solid:chevron-double-left'}
          />
        </SidebarToggleWrapper>
      </Tippy>
    </>
  )
}
