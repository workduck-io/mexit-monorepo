import styled from 'styled-components'

import { Input } from '@mexit/shared'

interface SidebarListWrapperProps {
  noMargin?: boolean
}
export const SidebarListWrapper = styled.div<SidebarListWrapperProps>`
  margin-top: ${({ noMargin }) => (noMargin ? '0' : '4rem')};
  padding: ${({ theme }) => theme.spacing.small};
  flex-grow: 1;
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
  margin: ${({ theme }) => `0 0 ${theme.spacing.small}`};
  margin-top: ${({ noMargin, theme }) => (noMargin ? '0' : theme.spacing.medium)};
  background: ${({ theme }) => theme.colors.form.input.bg};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${Input} {
    flex-grow: 1;
    background: transparent;
  }

  svg {
    flex-shrink: 0;
  }
`
