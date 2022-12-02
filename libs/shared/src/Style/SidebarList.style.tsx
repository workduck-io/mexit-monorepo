import { Input } from './Form'
import styled from 'styled-components'

interface SidebarListWrapperProps {
  noMargin?: boolean
}

export const SidebarListWrapper = styled.div<SidebarListWrapperProps>`
  margin-top: ${({ noMargin }) => (noMargin ? '0' : '1rem')};
  height: inherit;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
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
  margin: ${({ theme }) => `0 0`};
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

export const List = styled.section<{ scrollable?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.medium};
  overflow: hidden auto;
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
