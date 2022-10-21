import { ScrollStyles } from '@mexit/shared'
import styled, { css } from 'styled-components'

export const NoteItem = styled.div<{ selected?: boolean }>`
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
  max-height: 200px;
  overflow: auto;
`

export const NoteItemsWrapper = styled.div`
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  ${ScrollStyles}
`
