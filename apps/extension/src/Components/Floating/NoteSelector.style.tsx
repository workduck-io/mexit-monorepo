import styled, { css } from 'styled-components'

import { generateStyle } from '@workduck-io/mex-themes'

import { ScrollStyles } from '@mexit/shared'

export const NoteItem = styled.div<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  width: 94%;
  ${({ theme }) => generateStyle(theme.generic.noteSelect.menu)}
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  line-height: 1.5;
  margin: 0;
  outline: 0;
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.tiny};

  &.open {
    background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  }

  &:focus,
  &:not([disabled]):active {
    background: ${({ theme }) => theme.tokens.colors.primary.default};
    color: ${({ theme }) => theme.tokens.colors.primary.text};
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${theme.tokens.colors.primary.default};
      color: ${theme.tokens.colors.primary.text};
    `}

  &:disabled {
    color: ${({ theme }) => theme.tokens.text.disabled};
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
  ${({ theme }) => ScrollStyles(theme.tokens.surfaces.s[2])}
`
