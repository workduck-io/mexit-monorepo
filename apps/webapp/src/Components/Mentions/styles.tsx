import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

import { Title } from '@mexit/shared'

export const SelectWrapper = styled.div`
  width: 100%;
`

export const InviteWrapper = styled.div``
export const InviteFormWrapper = styled.form``

export const SharedPermissionsWrapper = styled.div`
  ${InviteWrapper} {
    ${Title} {
      display: none;
    }
    form {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing.small};
      ${SelectWrapper} {
        width: 60%;
      }
    }
  }
`

export const SharedPermissionsTable = styled.table`
  margin-top: ${({ theme }) => theme.spacing.large};
  min-width: 600px;
  border: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  caption {
    padding: ${({ theme }) => theme.spacing.small};
  }
`

export const ShareRow = styled.tr<{ hasChanged?: boolean; isRevoked?: boolean }>`
  ${({ isRevoked }) =>
    isRevoked &&
    css`
      opacity: 0.5;
      text-decoration: line-through;
    `}
`

export const ShareRowHeading = styled.thead`
  tr {
    border-bottom: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
    td {
      padding: ${({ theme }) => theme.spacing.small};
    }
  }
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`

export const ShareAlias = styled.td<{ hasChanged?: boolean }>`
  border-left: 2px solid transparent;
  ${({ theme, hasChanged }) =>
    hasChanged &&
    css`
      border-left: 2px solid ${theme.colors.primary};
    `}
  font-weight: bold;
  padding: ${({ theme }) => theme.spacing.small};
`

export const ShareAliasInput = styled.input`
  background: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])};
  border: none;
  color: ${({ theme }) => theme.colors.text.heading};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  &:hover {
    background: ${({ theme }) => transparentize(0.25, theme.colors.gray[9])};
  }
  &:focus {
    background: ${({ theme }) => transparentize(0.1, theme.colors.gray[9])};
  }
`

export const ShareEmail = styled.td`
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};
`

export const SharePermission = styled.td`
  width: 120px;
`

export const ShareRowAction = styled.td`
  width: 48px;
`
