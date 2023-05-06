import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { GenericFlex } from '../../Style/Filter.style'
import { ScrollStyles } from '../../Style/Helpers'
import { Ellipsis } from '../../Style/NodeSelect.style'
import { BodyFont, MainFont } from '../../Style/Search'

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

export const ItemLabel = styled.div<{ fontSize?: 'small' | 'regular' }>`
  ${Ellipsis}
  max-width: 12rem;

  ${({ fontSize }) => {
    switch (fontSize) {
      case 'small':
        return css`
          ${BodyFont}
        `
      case 'regular':
      default:
        return css`
          ${MainFont}
        `
    }
  }}
`

export const RootMenuWrapper = styled.button<{
  $noPadding?: boolean
  border: boolean
  noHover?: boolean
  noBackground?: boolean
}>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: ${({ border, theme }) => (border ? `1px solid ${theme.tokens.surfaces.separator}` : 'none')};
  transition: background 0.15s ease-in-out;
  ${({ $noPadding = false }) =>
    !$noPadding &&
    css`
      padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
    `}

  :hover {
    cursor: pointer;
  }

  &.${MenuItemClassName} {
    ${MenuItemStyles}
    &.open,
      &:hover {
      box-shadow: none;
      background: ${({ theme }) => theme.tokens.surfaces.s[3]};
    }
  }

  ${({ theme, noBackground }) =>
    noBackground
      ? css`
          background: none;
        `
      : css`
          background: ${theme.tokens.surfaces.s[3]};
        `}

  ${({ noHover, theme }) =>
    noHover &&
    css`
      color: ${theme.tokens.text.default};

      &.open,
      &:hover {
        box-shadow: ${theme.tokens.shadow.small};
        background: ${theme.tokens.surfaces.s[2]};
      }
    `}

  &:focus {
    outline: none;
  }
`

export const MenuWrapper = styled.div<{ type?: 'modal' }>`
  ${({ theme }) => generateStyle(theme.generic.contextMenu.menu)}
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  outline: 0;
  max-height: 300px;
  overflow-y: auto;
  z-index: ${({ type }) => (type === 'modal' ? 101 : 11)};
  ${({ theme }) => ScrollStyles(theme.tokens.surfaces.s[0])}
`

export const MenuItemWrapper = styled.button<{ isActive?: boolean }>`
  ${MenuItemStyles}
  cursor: pointer;

  ${({ isActive, theme }) =>
    isActive &&
    css`
      background: ${theme.tokens.surfaces.s[3]};
    `}
`
