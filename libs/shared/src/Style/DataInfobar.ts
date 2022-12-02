import { CollapsableHeaderTitle } from './Collapse'
import { Title } from './Typography'
import styled from 'styled-components'

export const DataInfobarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: calc(2 * ${({ theme }) => theme.spacing.large});
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  max-width: 100%;
  overflow-y: auto;

  ${CollapsableHeaderTitle} {
    font-size: 1.25rem;
  }
`

export const DataInfobarHeader = styled.div`
  margin-bottom: -3rem;
  ${Title} {
    display: flex;
    gap: ${({ theme }) => theme.spacing.tiny};
    align-items: center;
    font-size: 16px;
    font-weight: normal;
    margin: ${({ theme }) => theme.spacing.small} 0;

    svg {
      color: ${({ theme }) => theme.colors.text.fade};
    }
  }
`
