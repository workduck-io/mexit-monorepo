import styled from 'styled-components'

import { LoadingButton } from '@workduck-io/mex-components'

export const RemovalButton = styled(LoadingButton)`
  background-color: ${({ theme }) => `rgba(${theme.rgbTokens.colors.red}, 0.7)`};

  :hover {
    background-color: ${({ theme }) => `rgba(${theme.rgbTokens.colors.red}, 0.8)`};
    box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  }
`
