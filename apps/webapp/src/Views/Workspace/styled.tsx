import styled from 'styled-components'

import { PrimaryButton } from '@workduck-io/mex-components'

export const PageHeader = styled.header`
  display: flex;
  align-items: center;
  position: absolute;
  justify-content: flex-start;
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.large} 0`};
`

export const JoinContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.large} 0;
  display: flex;
  width: 400px;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  ${PrimaryButton} {
    width: 100%;
  }
`

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`
