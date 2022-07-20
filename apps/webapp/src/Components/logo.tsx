import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import React, { useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components'
import tinykeys from 'tinykeys'

import { FocusModeProp, focusStyles } from '@mexit/shared'

import useLayout from '../Hooks/useLayout'
import { useKeyListener } from '../Hooks/useShortcutListener'
import { useHelpStore } from '../Stores/useHelpStore'
import { useLayoutStore } from '../Stores/useLayoutStore'
import { TooltipTitleWithShortcut } from './Shortcuts'
import { useSidebarTransition } from './Sidebar/Transition'

const LogoWrapper = styled.div<{ $expanded: boolean }>`
  ${({ $expanded }) => ($expanded ? 'width: 100%;' : 'width: 40px;')}
`

export const Logo = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const theme = useTheme()

  return (
    <LogoWrapper $expanded={sidebar.expanded}>
      <svg height="32" viewBox="0 0 137 32" fill={theme.colors.primary} xmlns="http://www.w3.org/2000/svg">
        <path d="M6.73943 11.6292C3.7743 10.8513 2.21681 9.72041 0 6.17839C2.35657 18.2186 5.8755 23.1172 13.6727 27.0941C9.73444 21.9698 7.43539 17.8271 6.73943 11.6292Z" />
        <path d="M17.9045 31.3889C12.424 23.4841 9.25471 14.4759 9.25471 5.43732C11.2611 8.58421 12.5942 9.56617 15.2604 10.6954C16.0504 15.6543 18.5564 20.2029 21.758 24.0325C20.5808 26.9418 19.915 28.0831 17.9045 31.3889Z" />
        <path d="M22.5694 21.7885C24.1654 16.2449 24.7585 11.7113 25 5C23.0615 8.75546 21.4815 10.3266 18.7432 11.2846C19.0679 14.3424 20.6559 19.3817 22.5694 21.7885Z" />
        <path
          opacity={sidebar.expanded ? 1 : 0}
          fill={theme.colors.text.heading}
          d="M62.464 22.024H58.564L72.76 7.36H79.26V24H72.76V12.664L74.71 13.47L64.44 24H56.64L46.344 13.496L48.32 12.69V24H41.82V7.36H48.32L62.464 22.024ZM99.828 19.424H105.964C105.808 20.4293 105.305 21.3047 104.456 22.05C103.624 22.7953 102.402 23.376 100.79 23.792C99.1954 24.1907 97.1587 24.39 94.68 24.39C92.0627 24.39 89.8007 24.182 87.894 23.766C86.0047 23.35 84.5487 22.648 83.526 21.66C82.5034 20.672 81.992 19.3373 81.992 17.656C81.992 15.992 82.486 14.666 83.474 13.678C84.4794 12.6727 85.9267 11.9533 87.816 11.52C89.7054 11.0867 91.9934 10.87 94.68 10.87C97.3147 10.87 99.4727 11.104 101.154 11.572C102.835 12.04 104.075 12.8027 104.872 13.86C105.669 14.9 106.051 16.3127 106.016 18.098H88.336C88.4227 18.5487 88.6654 18.9647 89.064 19.346C89.48 19.7273 90.1127 20.0393 90.962 20.282C91.8287 20.5073 92.9814 20.62 94.42 20.62C95.9107 20.62 97.1327 20.516 98.086 20.308C99.0567 20.1 99.6374 19.8053 99.828 19.424ZM94.42 14.64C92.5827 14.64 91.1787 14.8393 90.208 15.238C89.2547 15.6367 88.6914 16.0353 88.518 16.434H99.958C99.8367 15.9833 99.3514 15.576 98.502 15.212C97.6527 14.8307 96.292 14.64 94.42 14.64ZM130.589 11.26L120.189 18.748L113.793 24H106.149L116.705 16.2L122.945 11.26H130.589ZM106.149 11.26H113.793L120.345 16.018L131.109 24H123.465L116.627 19.034L106.149 11.26Z"
        />
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
  width: 66px;
  height: 26px;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  opacity: 0.9;
  z-index: 10000;
  border-radius: 0 0 10px;
`

export const SidebarToggle = () => {
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
        content={<TooltipTitleWithShortcut title={sidebar.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
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
        content={
          <TooltipTitleWithShortcut title={rhSidebar.expanded ? 'Collapse Cooler Sidebar' : 'Expand Cooler Sidebar'} />
        }
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
