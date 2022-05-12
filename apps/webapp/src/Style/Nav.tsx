import { transparentize } from 'polished'
import { NavLink } from 'react-router-dom'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { CollapseWrapper } from './Collapse'
import { FocusModeProp, focusStyles } from './Editor'
import { Ellipsis } from './Search'

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
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.default};
  padding: 12px;
  text-decoration: none !important;
  cursor: pointer;
  font-weight: bold;
  width: 100%;

  font-size: 14px;

  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
    color: ${({ theme }) => theme.colors.text.heading};
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const Link = styled(NavLink)`
  ${ButtonOrLinkStyles}

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    svg,
    ${Count} {
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    }
  }
`

export const NavDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[6]};
  margin: ${({ theme }) => theme.spacing.small} 0;
`

export const MainLinkContainer = styled.div`
  width: 100%;
  margin: 1rem 0;
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
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
  padding: ${({ theme }) => theme.spacing.small};
`

export const CreateNewButton = styled.div`
  ${ButtonOrLinkStyles}
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.heading};
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
`

export interface NavWrapperProps extends FocusModeProp {
  $expanded: boolean
}

export const NavWrapper = styled(animated.div)<NavWrapperProps>`
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  transition: opacity 0.3s ease-in-out;
  padding: 2rem 0 0;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  gap: ${({ theme }) => theme.spacing.small};

  ${CollapseWrapper} {
    width: 100%;
    transition: opacity 0.2s ease-in-out;
    padding: 0 0 0 ${({ theme }) => theme.spacing.small};
  }

  #Collapse_tree {
    height: 100%;
    overflow-y: auto;
  }

  ${(props) => focusStyles(props)}

  ${({ $expanded }) =>
    !$expanded &&
    css`
      ${NavTitle} {
        opacity: 0;
      }

      ${Link}, ${NavButton}, ${CreateNewButton} {
        padding: 12px;
        max-width: 48px;
      }

      ${MainLinkContainer}, ${EndLinkContainer} {
      }

      ${NavLogoWrapper} {
        padding: 0px 22px 16px;
        padding-top: ${({ theme }) => (theme.additional.hasBlocks ? 8 : 28)}px;
      }

      ${CollapseWrapper} {
        pointer-events: none;
        cursor: default;
        opacity: 0;
        div {
          pointer-events: none !important;
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
