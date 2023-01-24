import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { GenericFlex } from '../../Style/Filter.style'
import { ScrollStyles } from '../../Style/Helpers'
import { Ellipsis } from '../../Style/NodeSelect.style'

import { MenuItemClassName } from './Dropdown.classes'

export const MenuItemCount = styled(GenericFlex)`
  color: ${({ theme }) => theme.tokens.text.fade};
`

export const MultiSelectIcon = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.small};
  ${({ theme, selected }) =>
    css`
      color: ${selected ? theme.tokens.colors.primary.default : theme.tokens.text.fade};
    `}
`

const MenuItemStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-align: left;
  line-height: 1.5;
  min-width: 110px;
  margin: 0;
  outline: 0;
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  ${({ theme }) => generateStyle(theme.generic.contextMenu.item)}

  &.open {
    background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  }

  &:focus,
  &:not([disabled]):active {
    ${MenuItemCount} {
      color: ${({ theme }) => theme.generic.contextMenu.item.iconColor};
    }
    ${MultiSelectIcon} {
      color: ${({ theme }) => theme.generic.contextMenu.item.iconColor};
    }
  }

  &:disabled {
    color: ${({ theme }) => theme.tokens.text.disabled};
  }
`

export const ItemLabel = styled.div`
  ${Ellipsis}
  max-width: 12rem;
`

export const RootMenuWrapper = styled.button<{ border?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border: ${({ border, theme }) => (border ? `1px solid ${theme.tokens.surfaces.separator}` : 'none')};
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.tokens.text.default};

  &.${MenuItemClassName} {
    ${MenuItemStyles}
    &.open,
    &:hover {
      box-shadow: none;
      background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    }
  }

  &.open,
  &:hover {
    box-shadow: ${({ theme }) => theme.tokens.shadow.small};
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
`

export const MenuWrapper = styled.div`
  ${({ theme }) => generateStyle(theme.generic.contextMenu.menu)}
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  outline: 0;
  max-height: 300px;
  overflow-y: auto;
  z-index: 11;
  ${({ theme }) => ScrollStyles(theme.tokens.surfaces.s[0])}
`

export const MenuItemWrapper = styled.button`
  ${MenuItemStyles}
`
