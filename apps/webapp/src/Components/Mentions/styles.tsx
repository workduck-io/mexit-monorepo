import styled, { css } from 'styled-components'

import { Button, LoadingButton } from '@workduck-io/mex-components'

import { Text } from '@mexit/shared'

export const InviteWrapper = styled.div``

export const InviteFormWrapper = styled.form``

export const StyledSaveButton = styled(Button)<{ primary?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};

  ${({ theme, primary }) =>
    primary &&
    css`
      background: ${theme.tokens.colors.primary.default};
    `}

  &:disabled {
    opacity: 0.6;
    color: ${({ theme }) => theme.tokens.text.fade};
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
`

export const InviteMessage = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  width: 100%;
  opacity: 0.5;
  user-select: none;

  ${Text} {
    color: ${({ theme }) => theme.tokens.text.fade};
  }
  gap: ${({ theme }) => theme.spacing.medium};
`

export const InviteFormFieldset = styled.fieldset<{ inline?: boolean }>`
  border: none;
  padding: 0;
  ${({ inline }) =>
    inline &&
    css`
      display: flex;
      align-items: center;
    `}
  gap: ${({ theme }) => theme.spacing.medium};
`

export const StyledLoadingButton = styled(LoadingButton)`
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  border: 1px solid transparent;

  &:disabled {
    opacity: 0.8;
    background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  }
`

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`

export const SharedPermissionsWrapper = styled.div``

export const ShareOwnerTag = styled.div`
  padding: ${({ theme }) => `${theme.spacing.small}`};
  color: ${({ theme }) => theme.tokens.text.default};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const TableBody = styled.tbody``

export const TableContainer = styled.section`
  display: block;
  max-height: 16rem;
  height: 16rem;
  width: 40vw;
  max-width: 660px;
  overflow: hidden auto;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(${({ theme }) => theme.rgbTokens.surfaces.separator}, 0.25);
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SharedPermissionsTable = styled.table`
  width: 100%;

  caption {
    text-align: left;
    padding: 0 0 ${({ theme }) => theme.spacing.medium} 0;
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
    td {
      padding: ${({ theme }) => theme.spacing.small};
      border-bottom: 1px solid rgba(${({ theme }) => theme.rgbTokens.surfaces.separator}, 0.25);
      &:first-child {
        padding-left: ${({ theme }) => theme.spacing.medium};
      }
    }
  }

  font-weight: bold;
  color: ${({ theme }) => theme.tokens.colors.primary.default};
`

export const ShareAlias = styled.td<{ hasChanged?: boolean }>`
  border-left: 2px solid transparent;
  ${({ theme, hasChanged }) =>
    hasChanged &&
    css`
      border-left: 2px solid ${theme.tokens.colors.primary.default};
    `}
  font-weight: bold;
  padding: ${({ theme }) => theme.spacing.small};
`

export const ShareAliasWithImage = styled.td`
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg,
  img {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  font-weight: 500;
`

export const ShareAliasInput = styled.input`
  background: ${({ theme }) => theme.tokens.surfaces.s[2]};
  border: none;
  color: ${({ theme }) => theme.tokens.text.heading};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  &:hover {
  }

  &:focus {
    background: ${({ theme }) => theme.tokens.surfaces.s[3]};
  }
`

export const ShareEmail = styled.td`
  max-width: 20rem;
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.tokens.text.fade};
`

export const SharePermission = styled.td<{ disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.small};
  width: 156px;
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `}
`

export const ShareRowActionsWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  ${Button} {
    height: 100%;
  }
`
export const ShareRowAction = styled.td``
