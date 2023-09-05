import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { ScrollStyles } from '../../Style/Helpers'
import { BodyFont } from '../../Style/Search'
import { DRAWER_HEIGHT_STATES } from '../Drawer/styled'

export const NoteItemsWrapper = styled.div<{ border?: boolean; height?: string }>`
  max-height: 20rem;
  display: flex;
  flex-direction: column;
  ${({ height }) =>
    height ??
    css`
   calc(${DRAWER_HEIGHT_STATES.NORMAL} - 7em)
   `};
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  ${({ border = true }) =>
    border &&
    css`
      border: 2px solid ${({ theme }) => theme.tokens.surfaces.separator};
    `}
  ${({ theme }) => ScrollStyles(theme.tokens.surfaces.s[2])};
  padding: ${({ theme }) => theme.spacing.small} 0;
`

export const NoteItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  ${({ theme }) => generateStyle(theme.generic.noteSelect.menu)}
  border: none;
  line-height: 1.5;
  margin: 0;
  outline: 0;
  padding: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.small};
  background: none;
  ${BodyFont}
  opacity: 1;

  color: ${({ theme }) => theme.tokens.text.fade};

  :hover {
    cursor: pointer;
    background: ${({ theme }) => theme.sidebar.tree.item.wrapper.active.surface};
    opacity: 0.8;
  }

  &.open {
    background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  }

  &:focus,
  &:not([disabled]):active {
    background: ${({ theme }) => theme.sidebar.tree.item.wrapper.active.surface};
    color: ${({ theme }) => theme.tokens.text.default};
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${({ theme }) => theme.sidebar.tree.item.wrapper.active.surface};
      color: ${theme.tokens.text.default};
    `}

  &:disabled {
    color: ${({ theme }) => theme.tokens.text.disabled};
  }
`
