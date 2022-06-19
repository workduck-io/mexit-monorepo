import { transparentize } from 'polished'
import styled from 'styled-components'

export const SharedPermissionsWrapper = styled.table`
  min-width: 600px;

  caption {
    background-color: ${({ theme }) => transparentize(0.75, theme.colors.gray[8])};
  }
`

export const ShareRow = styled.tr``
export const ShareRowHeading = styled.thead`
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`

export const ShareAlias = styled.td``
export const ShareEmail = styled.td`
  color: ${({ theme }) => theme.colors.text.fade};
`
export const SharePermission = styled.td`
  width: 120px;
`
export const ShareRemove = styled.td`
  width: 48px;
`
