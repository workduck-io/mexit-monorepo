import styled from 'styled-components'

import { CollapsableHeaderTitle } from './Collapse'

export const DataInfobarWrapper = styled.div`
  display: flex;
  height: calc(100% - 10rem);
  margin-top: 2rem;
  flex-direction: column;
  justify-content: flex-start;
  gap: calc(2 * ${({ theme }) => theme.spacing.large});
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  max-width: 100%;
  overflow-y: auto;

  ${CollapsableHeaderTitle} {
    font-size: 1.5rem;
  }
`
