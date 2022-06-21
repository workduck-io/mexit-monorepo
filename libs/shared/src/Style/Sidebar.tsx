import { Icon } from '@iconify/react'
import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'
import { FocusModeProp, focusStyles } from './Editor'
import { PixelToCSS, ThinScrollbar } from './Helpers'
import { Ellipsis } from './Search'

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
  max-width: ${({ theme }) => PixelToCSS(theme.width.sidebar)};
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

export const StyledTreeItemSwitcher = styled.button`
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
  color: ${({ theme }) => transparentize(0.3, theme.colors.text.fade)};
  margin-left: ${({ theme }) => theme.spacing.tiny};
  border-radius: 3px;
  transition: 0.3s ease;
  &:hover {
    transition: 0s ease;
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.gray[8]};
  }
`

export const SidebarItemTitle = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  max-width: 220px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
  span {
    ${Ellipsis}
  }
`

export const ItemCount = styled.div`
  flex-shrink: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.fade};
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
  color: ${({ theme }) => theme.colors.text.fade};
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

export const StyledTreeItem = styled.div<{ selected?: boolean; isDragging?: boolean; isBeingDroppedAt?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  border-radius: 6px 0px 0px 6px;
  padding-right: 12px;

  transition: 0.3s ease;
  &:hover {
    transition: 0s ease;
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${theme.colors.primary};
      color: ${theme.colors.text.oppositePrimary};
      ${ItemCount}, svg {
        color: ${theme.colors.text.oppositePrimary};
      }
      :hover {
        background: ${transparentize(0.3, theme.colors.primary)};
      }
      ${StyledTreeItemSwitcher} {
        &:hover svg {
          color: ${theme.colors.primary};
        }
      }
    `}

  ${({ isBeingDroppedAt, isDragging, theme }) =>
    (isBeingDroppedAt || isDragging) &&
    css`
      ${isDragging &&
      css`
        color: ${theme.colors.primary};
      `}
      background: ${theme.colors.gray[7]};
      box-shadow: inset 0 0 0 1px ${isDragging ? theme.colors.secondary : theme.colors.secondary};
    `}
`
