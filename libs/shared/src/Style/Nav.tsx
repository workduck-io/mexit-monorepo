import { NavLink } from 'react-router-dom'
import { animated } from 'react-spring'

import styled, { css } from 'styled-components'

import { generateStyle, MexTheme } from '@workduck-io/mex-themes'

import { CollapseWrapper } from './Collapse'
import { FocusModeProp, focusStyles } from './Editor'
import { ScrollStyles } from './Helpers'
import { Ellipsis } from './NodeSelect.style'
import { TabBody } from './Tab.Styles'

export const Scroll = css`
  overflow-y: auto;
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
    color: ${({ theme }) => theme.tokens.colors.primary.text} !important;
    background: ${({ theme }) => theme.tokens.colors.primary.default} !important;
    &::after {
      border-right-color: ${({ theme }) => theme.tokens.colors.primary.default} !important;
    }
  }
`

export const Count = styled.span`
  color: ${({ theme }) => theme.tokens.text.fade};
`

const ButtonOrLinkStyles = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => generateStyle(theme.sidebar.nav.link.main)}
  padding: 6px 12px;
  text-decoration: none !important;
  cursor: pointer;
  width: 100%;

  font-size: 12px;

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.tokens.text.default};
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SearchLink = styled(NavLink)`
  ${ButtonOrLinkStyles}
  background-color: rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.1);
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.tokens.colors.primary.default};
  svg {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }

  &.active {
    background-color: rgba(${({ theme }) => theme.rgbTokens.colors.primary.default}, 0.22);
    color: ${({ theme }) => theme.tokens.colors.primary.default};
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
    svg {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
`

export const Link = styled(NavLink)`
  ${ButtonOrLinkStyles}
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.tiny}`};

  &.active {
    ${({ theme }) => generateStyle(theme.sidebar.nav.link.main.selected)}
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
    svg {
      color: ${({ theme }) => theme.tokens.colors.primary.default};
    }
  }
`

export const NavSpacer = styled.div`
  flex-grow: 1;
`
export const NavDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.tokens.surfaces.separator};
  margin: ${({ theme }) => theme.spacing.small} 0;
`

export const MainLinkContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.tiny};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const EndLinkContainer = styled(MainLinkContainer)`
  border-top: 1px solid ${({ theme }) => theme.tokens.surfaces.separator};
  margin: 1rem 0 1rem;
`

export const ComingSoon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.tokens.text.fade};
  padding: ${({ theme }) => theme.spacing.small};

  margin-top: ${({ theme }) => theme.spacing.medium};
  &:first-child {
    margin-top: 0;
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
`

export const NavLogoWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  transition: padding 0.5s ease;

  cursor: pointer;
`

export const CreateNewButton = styled.div`
  ${ButtonOrLinkStyles}
  background-color: ${({ theme }) => theme.tokens.colors.primary.default};
  color: ${({ theme }) => theme.tokens.colors.primary.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  svg {
    height: 32px;
    width: 32px;
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
  :hover {
    background-color: ${({ theme }) => theme.tokens.colors.primary.default};
    svg {
      color: rgba(${({ theme }) => theme.rgbTokens.colors.primary.text}, 0.5);
    }
  }
`

export const NavButton = styled.div<{ primary?: boolean }>`
  ${ButtonOrLinkStyles}

  ${({ theme, primary }) =>
    primary &&
    css`
      color: ${theme.tokens.colors.primary.text};
      background-color: ${theme.tokens.colors.primary.default};
      transition: all 0.25s ease-in-out;

      svg {
        color: ${theme.tokens.colors.primary.text};
      }

      &:hover {
        background-color: ${theme.tokens.colors.primary.text};
        color: ${theme.tokens.colors.primary.default};

        svg {
          color: ${theme.tokens.colors.primary.default};
        }
      }
    `}

    &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    border-radius: ${({ theme }) => theme.borderRadius.small};
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
  $isMobile?: boolean
}

interface SidebarPosProps {
  $overlaySidebar: any
  theme: MexTheme
  $side: 'left' | 'right'
  $publicNamespace: any
  $isMobile?: boolean
}

const sidebarPos = ({ $overlaySidebar, theme, $side, $publicNamespace, $isMobile }: SidebarPosProps) =>
  $side === 'left'
    ? $overlaySidebar
      ? css`
          position: fixed;
          top: ${theme.additional.hasBlocks ? '2rem' : '0'};
          left: ${$isMobile
            ? '0px'
            : theme.additional.hasBlocks
            ? 'calc(86px + 1rem)'
            : $publicNamespace
            ? '0px'
            : '86px'};
          background: rgba(${theme.rgbTokens.surfaces.sidebar}, 0.5);
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
        background: rgba(${theme.rgbTokens.surfaces.sidebar}, 0.7);
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
    height: calc(100vh - 9rem);
  }

  ${focusStyles}
`

export const RHSideNav = styled(SideNav)`
  background: ${({ theme }) => theme.sidebar.wrapper.surface};
`

export const NavWrapper = styled(animated.div)<NavWrapperProps>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  min-height: 100%;
  padding: 0 0;
  user-select: none;

  background: ${({ theme }) => theme.sidebar.wrapper.surface};

  ${(props) => focusStyles(props)}

  ${Count} {
    display: none;
  }

  ${MainLinkContainer}, ${EndLinkContainer} {
  }

  ${EndLinkContainer} {
    margin-top: auto;
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
    background: rgba(${({ theme }) => theme.tokens.surfaces.s[3]}, 0.5);
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
    min-width: 10px;
    min-height: 32px;
  }
`
