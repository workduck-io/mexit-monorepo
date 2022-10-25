import styled from 'styled-components'

import { Input } from './Form'

export const SidebarListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  flex-grow: 1;
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

export const SidebarListFilter = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacing.small};
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

export const SidebarListFilterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};

  ${SidebarListFilter} {
    flex-grow: 1;
  }
`
