import styled, { css } from 'styled-components'

import { Input } from './Form'

interface SidebarListWrapperProps {
  noMargin?: boolean
  border?: boolean
}

export const SidebarListWrapper = styled.div<SidebarListWrapperProps>`
  margin-top: ${({ noMargin }) => (noMargin ? '0' : '1rem')};
  height: inherit;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`

export const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.fade};

  padding: ${({ theme }) => theme.spacing.medium};
`

export const FilteredItemsWrapper = styled.div<{ hasDefault?: boolean }>`
  display: flex;
  flex-direction: column;
  height: calc(
    100vh - ${({ theme }) => (theme.additional.hasBlocks ? '12rem' : '14rem')} -
      ${({ hasDefault }) => (hasDefault ? '3rem' : '0rem')}
  );

  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
`

export const SidebarListFilter = styled.div<SidebarListWrapperProps>`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.small};
  margin: 0;
  margin-top: ${({ noMargin, theme }) => (noMargin ? '0' : theme.spacing.medium)};
  background: ${({ theme }) => theme.generic.form.input.surface};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${Input} {
    flex-grow: 1;
    background: transparent;
    border: none !important;
    color: ${({ theme }) => theme.tokens.text.default};
  }

  &:hover {
    background: ${({ theme }) => theme.generic.form.input.hover.surface};
  }

  ${({ theme, border }) =>
    border
      ? css`
          border: 2px solid ${theme.tokens.surfaces.highlight};
          padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};

          &:focus-within {
            border: 2px solid ${({ theme }) => theme.tokens.colors.primary.default};
          }
        `
      : css`
          border: 1px solid transparent;

          &:focus-within {
            border: 1px solid ${({ theme }) => theme.tokens.colors.primary.default};
          }
        `}
  svg {
    flex-shrink: 0;
  }
`

export const List = styled.section<{
  scrollable?: boolean
  $noMargin?: boolean
  padding?: boolean
  $maxHeight?: string
}>`
  ${({ $noMargin }) =>
    !$noMargin &&
    css`
      margin-top: ${({ theme }) => theme.spacing.medium};
    `}

  ${({ $maxHeight }) =>
    $maxHeight
      ? css`
          max-height: ${$maxHeight};
        `
      : css`
          gap: ${({ theme }) => theme.spacing.small};
        `}

  display:flex;
  flex-direction: column;
  overflow: hidden auto;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overscroll-behavior: contain;
`

export const SidebarListFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};

  ${SidebarListFilter} {
    flex-grow: 1;
  }
`
