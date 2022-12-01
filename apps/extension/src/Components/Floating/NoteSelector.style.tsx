import { ScrollStyles } from '@mexit/shared'

import styled, { css } from 'styled-components'

export const NoteItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  width: 94%;
  background: ${({ theme }) => theme.colors.gray[10]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  line-height: 1.5;
  margin: 0;
  outline: 0;
  color: ${({ theme }) => theme.colors.text.default};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.tiny};

  &.open {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  &:focus,
  &:not([disabled]):active {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    `}

  &:disabled {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

export const SelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  max-height: 300px;
  overflow: auto;
`

export const NoteItemsWrapper = styled.div`
  max-height: 20rem;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  overflow-y: auto;
  overflow-x: hidden;
  ${({ theme }) => ScrollStyles(theme.colors.gray[7])}
`
