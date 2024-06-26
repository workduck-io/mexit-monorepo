import React from 'react'

import { Icon } from '@iconify/react'
import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { FocusModeProp, focusStyles } from './Editor'
import { ThinScrollbar } from './Helpers'
import { BodyFont } from './Search'

export const Sicon = styled(Icon)`
  height: 26px;
  width: 26px;
  padding-left: 7px;
  border-left: 1px solid ${({ theme }) => theme.colors.gray[7]};
  margin-left: -8px;
`
// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const SIcon = (props: any) => {
  return <Sicon {...props} />
}

export const SidebarDiv = styled.div<FocusModeProp>`
  height: 100%;
  padding-top: ${({ theme }) => theme.spacing.large};
  width: 100%;
  transition: opacity 0.3s ease-in-out;
  ${focusStyles}
`

export const SidebarContent = styled.div`
  ${ThinScrollbar};
  flex-grow: 1;
  overflow-x: hidden;
  max-height: 95vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.medium};
`
export const SectionHeading = styled.div`
  user-select: none;
  margin: ${({ theme }) => theme.spacing.medium} 0 ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  h2 {
    margin: 0;
    font-weight: normal;
    font-size: 1.2rem;
  }
  svg {
    margin-right: ${({ theme }) => theme.spacing.tiny};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const SidebarDivider = styled.div`
  height: 2px;
  background: ${({ theme }) => theme.colors.gray[8]};
  margin: ${({ theme }) => theme.spacing.large} 0;
`

export const SidebarSection = styled.div`
  color: ${({ theme }) => theme.colors.text.subheading};

  /* &.starred:hover {
    color: ${({ theme }) => theme.colors.palette.yellow};
  }
  &.tree:hover {
    color: ${({ theme }) => theme.colors.secondary};
  } */
`
export const StyledTreeSwitcher = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 24px;
  flex-shrink: 0;
  margin-left: ${({ theme }) => theme.spacing.tiny};
`
export const StyledTreeItemSwitcher = styled(StyledTreeSwitcher)`
  color: rgba(${({ theme }) => theme.rgbTokens.text.fade}, 0.7);
  transition: 0.1s ease;
  &:hover {
    transition: 0s ease;
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`

export const ItemTitleText = styled.span`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ItemTitle = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  max-width: 220px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const ItemCount = styled.div`
  flex-shrink: 0;
  font-size: 0.9rem;
  ${({ theme }) => generateStyle(theme.sidebar.tree.item.count)};
`

export const TooltipContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const TooltipCount = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  gap: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.tokens.text.fade};
`
export const ItemContent = styled.div`
  cursor: pointer;
  padding: 8px 0px;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const UnreadIndicator = styled.div`
  color: ${({ theme }) => theme.tokens.colors.primary.default};
  svg {
    height: 0.75rem;
    width: 0.75rem;
  }
`

export const StyledTreeItem = styled.div<{
  selected?: boolean
  hasIconHover?: boolean
  isStub?: boolean
  isDragging?: boolean
  isBeingDroppedAt?: boolean
  hasMenuOpen?: boolean
  noSwitcher?: boolean
  isUnread?: boolean
  isHighlighted?: boolean
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding-right: 8px;
  ${({ theme }) => generateStyle(theme.sidebar.tree.item.wrapper)};

  &:hover {
    transition: 0s ease;
    color: ${({ theme }) => theme.tokens.text.fade};
  }

  ${BodyFont};

  color: ${({ theme }) => theme.tokens.text.fade};

  transition: 0.25s ease;

  ${({ isUnread }) =>
    isUnread &&
    css`
      font-weight: bold;
    `}

  ${({ noSwitcher, theme }) =>
    noSwitcher &&
    css`
      padding-left: ${theme.spacing.small};
    `}

  ${({ hasMenuOpen, isHighlighted, theme }) =>
    (hasMenuOpen || isHighlighted) &&
    css`
      background: ${theme.sidebar.tree.item.wrapper.active.surface};
      color: ${theme.sidebar.tree.item.wrapper.active.textColor};
    `}

  /* opacity: 0.7; */
  

  ${({ selected, hasMenuOpen, theme }) =>
    selected &&
    css`
      /* ${({ theme }) => generateStyle(theme.sidebar.tree.item.wrapper)}; */
      background: ${theme.sidebar.tree.item.wrapper.active.surface};
      color: ${theme.tokens.text.default};
      font-weight: bold;
      ${hasMenuOpen &&
      css`
        color: ${theme.tokens.colors.primary.text};
      `}
      ${StyledTreeItemSwitcher} {
        &:hover svg {
          color: ${theme.tokens.colors.primary.default};
        }
      }
    `}

  ${({ isStub }) =>
    isStub &&
    css`
      opacity: 0.8;
      color: ${({ theme }) => theme.tokens.text.disabled};
      svg {
        color: ${({ theme }) => theme.tokens.text.disabled};
      }
      background-color: transparent;
    `}

  ${({ isBeingDroppedAt, isDragging, theme }) =>
    (isBeingDroppedAt || isDragging) &&
    css`
      ${isDragging &&
      css`
        color: ${theme.tokens.colors.primary.default};
      `}
      background: ${theme.sidebar.tree.item.wrapper.active.surface};
      box-shadow: inset 0 0 0 1px ${isDragging ? theme.tokens.colors.secondary : theme.tokens.colors.secondary},
        ${({ theme }) => theme.tokens.shadow.medium};
    `}


  ${({ hasIconHover }) =>
    hasIconHover === true &&
    css`
      .iconOnHover {
        display: none;
      }
      &:hover {
        .iconOnHover {
          display: inherit;
        }
        .defaultIcon {
          display: none;
        }
      }
    `}
`

export const NavigationClusterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: ${({ theme }) => theme.spacing.tiny};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`

export const NavigationButton = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.25;
      pointer-events: none;
    `}
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[7]};
  }
`
