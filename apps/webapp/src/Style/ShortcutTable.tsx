import styled, { css } from 'styled-components'

export const TableWrapperScrollable = styled.div`
  max-height: 800px;
  overflow: auto;
`

export const StyledTable = styled.table`
  margin: ${({ theme }) => theme.spacing.medium};

  border-collapse: collapse;
  min-width: 600px;
  border: 1px solid ${({ theme }) => theme.tokens.surfaces.s[3]};

  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
`

export const StyledTHead = styled.thead`
  background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
`

export const StyledRow = styled.tr<{ highlight?: boolean }>`
  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.tokens.surfaces.s[2]};
  }

  ${({ theme, highlight }) =>
    highlight &&
    css`
      border: 1px solid ${theme.tokens.colors.primary.default};
      border-radius: ${theme.borderRadius.small};
    `}
`

export const StyledTH = styled.th`
  padding: ${({ theme }) => theme.spacing.small};
  text-align: left;
`

export const StyledTBody = styled.tbody``

export const StyledTD = styled.td`
  padding: ${({ theme }) => theme.spacing.small};
  &:nth-child(2) {
    color: ${({ theme }) => theme.tokens.colors.primary.default};
  }
`

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
