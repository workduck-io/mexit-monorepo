import styled, { css } from 'styled-components'

import { FocusModeProp, focusStyles } from './Editor'
import { FadeInOut } from './Layouts'

interface SidebarToggleWrappperProps extends FocusModeProp {
  expanded: boolean
  $isVisible?: boolean
  show: boolean
  side: 'right' | 'left'
  endColumnWidth?: string
}

// TODO: this isn't relative to the sidebar so ends of staying at the top when the page is scrolled
export const SidebarToggleWrapper = styled.div<SidebarToggleWrappperProps>`
  position: fixed;
  display: flex;
  align-items: center;
  ${(props) => focusStyles(props)}

  ${({ expanded, side, theme, endColumnWidth }) =>
    side === 'left'
      ? expanded
        ? css`
            display: none;
          `
        : css`
            top: ${theme.additional.hasBlocks ? 67 : 44}px;
            left: ${theme.additional.hasBlocks ? 86 : 70}px;
          `
      : expanded
      ? css`
          top: ${theme.additional.hasBlocks ? 67 : 44}px;
          right: calc(${(endColumnWidth ?? '400px') + ' + ' + (theme.additional.hasBlocks ? 0 : -15)}px);
        `
      : css`
          top: ${theme.additional.hasBlocks ? 67 : 44}px;
          right: ${theme.additional.hasBlocks ? 8 : 8}px;
        `}

  ${({ $isVisible, $focusMode }) => !$focusMode && FadeInOut($isVisible)}

  ${({ $isVisible }) =>
    $isVisible &&
    css`
      transition: left 0.5s ease, top 0.5s ease, right 0.5s ease, background 0.5s ease, box-shadow 0.5s ease;
    `}

  z-index: 9999999999;
  padding: 8px;
  border-radius: 100%;
  background: ${({ theme }) => theme.tokens.surfaces.sidebar};
  color: ${({ theme }) => theme.tokens.text.fade};

  svg {
    height: 16px;
    width: 16px;
  }

  ${({ show }) =>
    !show &&
    css`
      display: none;
    `}

  &:hover {
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
    background: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.text};
  }

  &:active {
    transition: background 0.1s ease;
    background-color: ${({ theme }) => theme.tokens.colors.primary.active};
    color: ${({ theme }) => theme.tokens.colors.primary.text};
  }
`
