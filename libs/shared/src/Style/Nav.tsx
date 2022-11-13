import { transparentize } from 'polished'
import { NavLink } from 'react-router-dom'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

import { CollapseWrapper } from './Collapse'
import { FocusModeProp, focusStyles } from './Editor'
import { ScrollStyles } from './Helpers'
import { Ellipsis } from './NodeSelect.style'
import { TabBody } from './Tab.Styles'

export const Scroll = css`
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export const NavTitle = styled.span`
  flex-grow: 1;
  flex-shrink: 0;
  transition: opacity 0.2s ease-in-out;
  ${Ellipsis}
`

export const navTooltip = css`
  .nav-tooltip {
    color: ${({ theme }) => theme.colors.text.oppositePrimary} !important;
    background: ${({ theme }) => theme.colors.primary} !important;
    &::after {
      border-right-color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`

export const Count = styled.span`
  color: ${({ theme }) => theme.colors.text.fade};
`

const ButtonOrLinkStyles = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.fade};
  padding: 6px 12px;
  text-decoration: none !important;
  cursor: pointer;
  width: 100%;

  font-size: 12px;

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.text.default};
  }

  &:hover {
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
    color: ${({ theme }) => theme.colors.text.heading};
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SearchLink = styled(NavLink)`
  ${ButtonOrLinkStyles}
  background-color: ${({ theme }) => transparentize(1, theme.colors.primary)};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.primary};
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background-color: ${({ theme }) => transparentize(0.88, theme.colors.primary)};
    color: ${({ theme }) => theme.colors.primary};
    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

export const Link = styled(NavLink)`
  ${ButtonOrLinkStyles}

  &.active {
    background-color: ${({ theme }) => transparentize(0.88, theme.colors.primary)};
    color: ${({ theme }) => theme.colors.primary};
    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

export const NavSpacer = styled.div`
  flex-grow: 1;
`
export const NavDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[6]};
  margin: ${({ theme }) => theme.spacing.small} 0;
`

export const MainLinkContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const EndLinkContainer = styled.div`
  border-top: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;
  margin: 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const ComingSoon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.small};

  margin-top: ${({ theme }) => theme.spacing.medium};
  &:first-child {
    margin-top: 0;
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

export const NavLogoWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  padding-left: 5rem;
  transition: padding 0.5s ease;

  cursor: pointer;
`

export const CreateNewButton = styled.div`
  ${ButtonOrLinkStyles}
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.oppositePrimary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  svg {
    height: 32px;
    width: 32px;
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
  :hover {
    background-color: ${({ theme }) => theme.colors.primary};
    svg {
      color: ${({ theme }) => transparentize(0.5, theme.colors.text.oppositePrimary)};
    }
  }
`

export const NavButton = styled.div<{ primary?: boolean }>`
  ${ButtonOrLinkStyles}

  ${({ theme, primary }) =>
    primary &&
    css`
      color: ${theme.colors.text.oppositePrimary};
      background-color: ${theme.colors.primary};
      transition: all 0.25s ease-in-out;

      svg {
        color: ${theme.colors.text.oppositePrimary};
      }

      &:hover {
        background-color: ${theme.colors.text.oppositePrimary};
        color: ${theme.colors.primary};

        svg {
          color: ${theme.colors.primary};
        }
      }
    `}

    &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[6]};
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
    min-width: 10px;
    min-height: 32px;
  }
`

export const MainNav = styled.div<FocusModeProp>`
  ${Scroll};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-shrink: 0;
  width: 86px;
  z-index: 11;

  min-height: 100%;
  transition: opacity 0.3s ease-in-out;
  padding: 0 0;
  gap: ${({ theme }) => theme.spacing.small};
  user-select: none;

  ${(props) => focusStyles(props)}
`

export interface NavWrapperProps extends FocusModeProp {
  $expanded: boolean
  $show: boolean
}

export interface SideNavProps extends NavWrapperProps {
  $overlaySidebar: boolean
  $side: 'left' | 'right'
  $publicNamespace: boolean
  $isUserEditing?: boolean
}

const sidebarPos = ({ $overlaySidebar, theme, $side, $publicNamespace }) =>
  $side === 'left'
    ? $overlaySidebar
      ? css`
          position: fixed;
          top: ${theme.additional.hasBlocks ? '2rem' : '0'};
          left: ${theme.additional.hasBlocks ? 'calc(86px + 1rem)' : $publicNamespace ? '0px' : '86px'};
          background: ${transparentize(0.5, theme.colors.background.sidebar)};
          backdrop-filter: blur(10px);
        `
      : css`
          position: relative;
        `
    : $overlaySidebar
    ? // Now the RHS
      css`
        position: fixed;
        top: ${theme.additional.hasBlocks ? '2rem' : '0'};
        right: ${theme.additional.hasBlocks ? '1rem' : '0'};
        background: ${transparentize(0.5, theme.colors.background.sidebar)};
        backdrop-filter: blur(10px);
      `
    : css`
        position: relative;
      `

export const SideNav = styled(animated.div)<SideNavProps>`
  overflow-x: hidden;
  overflow-y: auto;
  min-height: 100%;
  height: 100%;
  z-index: 10;
  padding: ${({ theme }) => theme.spacing.large} 0 0;

  & div {
    ${({ $isUserEditing }) => ScrollStyles($isUserEditing ? 'transparent' : undefined)}
  }

  ${sidebarPos}

  ${({ $expanded, $show }) =>
    $expanded &&
    $show &&
    css`
      width: 100%;
    `}

  ${TabBody} {
    height: calc(100vh);
  }

  ${focusStyles}
`

export const RHSideNav = styled(SideNav)`
  background: ${({ theme }) => theme.colors.background.sidebar};
`

export const NavWrapper = styled(animated.div)<NavWrapperProps>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  min-height: 100%;
  padding: 0 0;
  user-select: none;

  background: ${({ theme }) => theme.colors.background.sidebar};

  ${(props) => focusStyles(props)}

  ${Count} {
    display: none;
  }

  ${MainLinkContainer}, ${EndLinkContainer} {
  }

  ${EndLinkContainer} {
    margin-top: auto;
  }

  ${NavLogoWrapper} {
    padding: 0px 22px 0px;
    padding-top: ${({ theme }) => (theme.additional.hasBlocks ? 8 : 30)}px;
  }

  ${CollapseWrapper} {
    pointer-events: none;
    cursor: default;
    max-height: 64px;
    opacity: 0;
    div {
      pointer-events: none !important;
    }
  }

  &::-webkit-scrollbar-thumb,
  *::-webkit-scrollbar-thumb {
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
    min-width: 10px;
    min-height: 32px;
  }
`
