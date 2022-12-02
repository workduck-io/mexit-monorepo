import styled, { css } from 'styled-components'

import { GenericFlex } from '../../Style/Filter.style'
import { ScrollStyles } from '../../Style/Helpers'
import { Ellipsis } from '../../Style/NodeSelect.style'

import { MenuItemClassName } from './Dropdown.classes'

export const MenuItemCount = styled(GenericFlex)`
  color: ${({ theme }) => theme.colors.text.fade};
`

export const MultiSelectIcon = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.small};
  ${({ theme, selected }) =>
    css`
      color: ${selected ? theme.colors.primary : theme.colors.text.fade};
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
  color: ${({ theme }) => theme.colors.text.default};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};

  &.open {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  &:focus,
  &:not([disabled]):active {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    ${MenuItemCount} {
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    }
    ${MultiSelectIcon} {
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    }
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

export const ItemLabel = styled.div`
  ${Ellipsis}
  max-width: 12rem;
`

export const RootMenuWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.default};

  &.${MenuItemClassName} {
    ${MenuItemStyles}
  }

  &.open,
  &:hover {
    background: ${({ theme }) => theme.colors.gray[7]};
  }
`

export const MenuWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[8]};
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.4);
  outline: 0;
  max-height: 300px;
  overflow-y: auto;
  z-index: 11;
  ${({ theme }) => ScrollStyles(theme.colors.gray[10])}
`

export const MenuItemWrapper = styled.button`
  ${MenuItemStyles}
`
