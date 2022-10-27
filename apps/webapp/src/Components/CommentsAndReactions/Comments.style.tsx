import { Title } from '@workduck-io/mex-components'
import styled from 'styled-components'

export const CommentsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};

  ${Title} {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.colors.text.fade};
    margin: 0;
  }
`

